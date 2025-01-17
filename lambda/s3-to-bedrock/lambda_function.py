import json
import boto3

def invoke_bedrock_model(client, model_id, payload):
    try:
        response = client.invoke_model(
            modelId=model_id,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(payload)
        )
        body_content = response['body'].read().decode("utf-8")
        return json.loads(body_content)
    except Exception as e:
        print(f"Error invoking Bedrock model: {str(e)}")
        raise

def save_to_s3(bucket_name, object_key, content, region_name="us-west-2"):
    try:
        s3 = boto3.client("s3", region_name=region_name)
        s3.put_object(Bucket=bucket_name, Key=object_key, Body=content)
        print(f"Output successfully saved to s3://{bucket_name}/{object_key}")
    except Exception as e:
        print(f"Error saving to S3: {str(e)}")
        raise

def lambda_handler(event, context):
    region_name = "us-west-2"  # Bedrock region
    model_id = "anthropic.claude-3-5-sonnet-20241022-v2:0"
    output_bucket_name = "ankimozzi-questions"  # Output bucket for results

    try:
        # Initialize Bedrock client
        bedrock = boto3.client("bedrock-runtime", region_name=region_name)
        print("Bedrock client initialized successfully.")
    except Exception as e:
        print(f"Error initializing Bedrock client: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Failed to initialize Bedrock client."})
        }

    try:
        # Process S3 Event to read input text
        record = event["Records"][0]
        bucket_name = record["s3"]["bucket"]["name"]
        object_key = record["s3"]["object"]["key"]

        print(f"Processing file: s3://{bucket_name}/{object_key}")

        s3 = boto3.client("s3", region_name=region_name)
        s3_response = s3.get_object(Bucket=bucket_name, Key=object_key)
        file_content = s3_response["Body"].read().decode("utf-8")
        print(f"File content read successfully, file size: {len(file_content)} characters")

        # Prepare payload for Bedrock model
        messages_payload = {
            "messages": [
                {
                    "role": "user",
                    "content": f"""Please generate 20 questions, their answers, and one category(like physics, common sense, computerscience) based on the following text:
                    
Category: [Category]
Questions and Answers:
1. Q: [Question 1]
   A: [Answer 1]
...
20. Q: [Question 20]
   A: [Answer 20]

Text:
{file_content}

Assistant:"""
                }
            ],
            "max_tokens": 2048,
            "temperature": 0.7,
            "anthropic_version": "bedrock-2023-05-31"
        }

        # Invoke the Bedrock model
        bedrock_response = invoke_bedrock_model(bedrock, model_id, messages_payload)
        print("Bedrock response received.")

        # Extract content from response
        content = bedrock_response.get("content", [{"type": "text", "text": ""}])
        if not content or not content[0].get("text", "").strip():
            raise ValueError("No text content received from Bedrock model.")
        completion_text = content[0]["text"]

        # Parse response to extract category and questions with answers
        lines = completion_text.splitlines()
        category = None
        questions_with_answers = []
        current_question = None
        current_answer = None

        for line in lines:
            line = line.strip()
            if line.lower().startswith("category:"):
                category = line.split("Category:", 1)[1].strip()
            elif line and line[0].isdigit() and "Q:" in line:
                if current_question and current_answer:
                    questions_with_answers.append({
                        "question": current_question,
                        "answer": current_answer
                    })
                current_question = line.split("Q:", 1)[1].strip()
                current_answer = None
            elif line.startswith("A:"):
                current_answer = line.split("A:", 1)[1].strip()

        # Append last question-answer pair
        if current_question and current_answer:
            questions_with_answers.append({
                "question": current_question,
                "answer": current_answer
            })

        # Debugging output
        print(f"Extracted Category: {category}")
        print(f"Extracted Questions and Answers: {json.dumps(questions_with_answers, indent=4)}")

        # Save parsed data to S3
        output_data = {
            "category": category,
            "file_name" : object_key.split("/")[-1],
            "questions": questions_with_answers
        }
        output_key = object_key.replace(".txt", ".json")
        save_to_s3(output_bucket_name, output_key, json.dumps(output_data, indent=4))

    except Exception as e:
        print(f"Error processing file or calling Bedrock: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": str(e)})
        }

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Processing complete"})
        }
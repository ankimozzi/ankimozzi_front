import boto3
import json
from io import StringIO

s3 = boto3.client('s3')

def lambda_handler(event, context):
 # 쿼리 파라미터 안전하게 추출
    query_params = event.get('queryStringParameters', {}) or {}
    deck_name = query_params.get('deck_name')
    
    # 디버깅용 로그
    print("전체 이벤트:", json.dumps(event, indent=2))
    print("쿼리 파라미터:", query_params)
    print("deck_name:", deck_name)
    
    if not deck_name:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "status": "error",
                "message": "'deck_name' is missing in the query parameters."
            })
        }

    # S3 버킷 및 키 설정
    source_bucket = "ankimozzi-questions"
    source_key = f"transcribe-{deck_name}.mp4.json"

    try:
        # S3에서 JSON 데이터 가져오기
        response = s3.get_object(Bucket=source_bucket, Key=source_key)
        json_data = json.loads(response['Body'].read())

        # "questions" 리스트 추출
        questions = json_data.get('questions')
        if not questions or not isinstance(questions, list):
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "status": "error",
                    "message": "JSON data does not contain a valid 'questions' list."
                })
            }

        # 데이터 변환 (answer    question 형식)
        output_buffer = StringIO()
        for item in questions:
            answer = item.get('answer', '').replace("\n", " ")
            question = item.get('question', '').replace("\n", " ")
            output_buffer.write(f"{answer}\t{question}\n")

        # 데이터 반환
        output_buffer.seek(0)
        return {
            "statusCode": 200,
            "body": json.dumps({
                "status": "complete",
                "message": "File is ready.",
                "data": output_buffer.getvalue()
            })
        }

    except s3.exceptions.NoSuchKey:
        # 파일이 존재하지 않을 경우 처리
        return {
            "statusCode": 200,  # Polling이 계속될 수 있도록 200 반환
            "body": json.dumps({
                "status": "processing",
                "message": "File not yet available. Please try again."
            })
        }

    except Exception as e:
        # 기타 예외 처리
        return {
            "statusCode": 500,
            "body": json.dumps({
                "status": "error",
                "message": f"An unexpected error occurred: {str(e)}"
            })
        }

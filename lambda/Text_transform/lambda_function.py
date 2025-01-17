import boto3
import json
from urllib.parse import unquote_plus

s3_client = boto3.client('s3')

# 출력 버킷 이름 (사용자가 지정한 버킷 이름)
OUTPUT_BUCKET_NAME = 'ankkimozzi-text-processed'  # 여기에 저장할 S3 버킷 이름을 입력하세요.

def lambda_handler(event, context):
    # S3 이벤트에서 버킷 이름과 객체 키 가져오기
    input_bucket_name = event['Records'][0]['s3']['bucket']['name']
    encoded_key = event['Records'][0]['s3']['object']['key']
    
    # URI 디코딩
    input_file_name = unquote_plus(encoded_key)
    print(f"Received file: s3://{input_bucket_name}/{input_file_name}")
    
    # Transcribe 결과 JSON 다운로드
    try:
        response = s3_client.get_object(Bucket=input_bucket_name, Key=input_file_name)
        transcribe_json = json.loads(response['Body'].read().decode('utf-8'))
        print("Transcribe JSON loaded successfully")
    except Exception as e:
        print(f"Error loading JSON from S3: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error loading JSON: {str(e)}")
        }
    
    # 텍스트 추출
    try:
        # "results.transcripts"에서 텍스트만 추출
        transcripts = transcribe_json.get('results', {}).get('transcripts', [])
        if not transcripts:
            raise ValueError("No transcripts found in the Transcribe JSON")

        # 모든 텍스트를 결합
        extracted_text = " ".join([t['transcript'] for t in transcripts])
        print(f"Extracted text successfully")
    except Exception as e:
        print(f"Error extracting text: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error extracting text: {str(e)}")
        }
    
    # 출력 파일 이름 설정
    output_file_name = input_file_name.replace('.json', '.txt')
    print(f"Output file will be stored as: s3://{OUTPUT_BUCKET_NAME}/{output_file_name}")
    
    # S3에 정제된 텍스트 업로드 (사용자가 지정한 출력 버킷)
    try:
        s3_client.put_object(
            Bucket=OUTPUT_BUCKET_NAME,
            Key=output_file_name,
            Body=extracted_text,
            ContentType='text/plain'
        )
        print(f"Cleaned text uploaded to: s3://{OUTPUT_BUCKET_NAME}/{output_file_name}")
    except Exception as e:
        print(f"Error uploading cleaned text: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error uploading cleaned text: {str(e)}")
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps(f"Successfully processed and uploaded cleaned text to: s3://{OUTPUT_BUCKET_NAME}/{output_file_name}")
    }
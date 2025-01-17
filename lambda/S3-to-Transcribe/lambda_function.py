import boto3
import json
import re
from urllib.parse import unquote_plus  # URI 디코딩용 라이브러리

s3_client = boto3.client('s3')
transcribe_client = boto3.client('transcribe')

def lambda_handler(event, context):
    # Lambda 시작 시 이벤트 데이터를 출력
    print("Received event:", json.dumps(event, indent=2))
    
    # S3 이벤트에서 버킷 이름과 객체 키 가져오기
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    encoded_key = event['Records'][0]['s3']['object']['key']
    
    # URI 디코딩
    file_name = unquote_plus(encoded_key)
    print(f"Encoded key: {encoded_key}")
    print(f"Decoded key: {file_name}")
    
    # 파일 확장자로 MediaFormat 결정
    file_extension = file_name.split('.')[-1].lower()
    if file_extension not in ['mp4', 'wav', 'mp3', 'flac', 'ogg']:
        print(f"Unsupported file format: {file_extension}")
        return {
            'statusCode': 400,
            'body': json.dumps(f'Unsupported file format: {file_extension}')
        }
    
    # Transcribe 작업 이름 설정 (특수 문자 제거 후 첫 50자 사용)
    sanitized_file_name = re.sub(r'[^\w.-]', '_', file_name.split('/')[-1])  # 공백 및 특수 문자 `_`로 대체
    print(f"Sanitized file name: {sanitized_file_name}")
    job_name = f'transcribe-{sanitized_file_name[:50]}'  # 첫 50자를 사용하여 작업 이름 생성
    
    # S3 URI 생성
    s3_uri = f's3://{bucket_name}/{file_name}'
    print(f"Generated S3 URI: {s3_uri}")
    
    # S3 객체 존재 여부 확인
    try:
        s3_client.head_object(Bucket=bucket_name, Key=file_name)
        print(f"File exists: {bucket_name}/{file_name}")
    except Exception as e:
        print(f"Error: File not found: {bucket_name}/{file_name}. Error: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps(f"File not found: {file_name}. Error: {str(e)}")
        }
    
    # Transcribe 작업 시작
    try:
        response = transcribe_client.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': s3_uri},
            MediaFormat=file_extension,
            LanguageCode='en-US',  # 언어 코드 변경 필요 시 변경
            OutputBucketName='ankkimozzi-text-extracted',  # 결과를 저장할 S3 버킷
        )
        print(f"Transcription job started: {response['TranscriptionJob']['TranscriptionJobName']}")
        return {
            'statusCode': 200,
            'body': json.dumps('Transcription job started successfully')
        }
    except Exception as e:
        print(f"Error starting transcription job: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error starting transcription job: {str(e)}')
        }
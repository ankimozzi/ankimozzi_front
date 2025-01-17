import json
import boto3
import time
import uuid  # UUID를 생성하기 위한 모듈

# DynamoDB 및 S3 클라이언트 초기화
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')
glue = boto3.client('glue')  # Glue 클라이언트 초기화

# DynamoDB 테이블 이름
TABLE_NAME = "Ankkimozzi2"

# Glue Workflow 이름
WORKFLOW_NAME = 'anki'

def lambda_handler(event, context):
    try:
        # 타이머 시작
        total_start_time = time.time()
        print("Flag 1: Start Lambda Execution")

        # S3 이벤트에서 버킷 이름과 파일 키 가져오기
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        file_key = event['Records'][0]['s3']['object']['key']
        print("Flag 2: S3 Event Parsed")
        
        # 파일의 제목(대표 이름)을 파일 이름에서 추출
        file_title = file_key.split("/")[-1]  # 파일 이름 추출
        file_title = file_title.rsplit(".", 1)[0]  # 확장자 제거
        print(f"File Title: {file_title}")

        # S3에서 JSON 파일 읽기
        s3_start_time = time.time()
        s3_object = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        file_content = s3_object['Body'].read().decode('utf-8')
        print(f"Flag 3: S3 File Read in {time.time() - s3_start_time:.2f} seconds")

        # JSON 파일 파싱
        json_start_time = time.time()
        new_data = json.loads(file_content)
        print(f"Flag 4: JSON Parsing Done in {time.time() - json_start_time:.2f} seconds")
        
        # DynamoDB 테이블 참조
        table = dynamodb.Table(TABLE_NAME)

        # new_data에서 category 추출
        category = new_data['category']
        print(f"Processing Category: {category}")

        # 고유 ID 생성 (timestamp 또는 uuid)
        unique_id = str(uuid.uuid4())  # 고유한 UUID 생성
        timestamp = int(time.time())  # 타임스탬프 생성 (Unix time)

        # 새로운 데이터 생성
        new_item = {
            'category': category,  # 파티션 키
            'id': unique_id,  # 고유 ID
            'question': file_title,  # 파일 제목
            'url': f"https://{bucket_name}.s3.amazonaws.com/{file_key}",  # S3 파일 경로
            'timestamp': timestamp  # 타임스탬프 추가
        }

        # DynamoDB에 새로운 항목 추가
        dynamo_put_start_time = time.time()
        table.put_item(Item=new_item)
        print(f"Flag 5: DynamoDB PutItem in {time.time() - dynamo_put_start_time:.2f} seconds")
        print(f"Added Item: {new_item}")

        # Glue Workflow 실행
        print(f"Flag 6: Starting Glue Workflow: {WORKFLOW_NAME}")
        glue_response = glue.start_workflow_run(Name=WORKFLOW_NAME)
        print(f"Started Workflow: {glue_response['RunId']}")

        # Lambda 실행 시간 측정
        print(f"Flag 7: Total Execution Time: {time.time() - total_start_time:.2f} seconds")

        # 성공 메시지 반환
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Data processed successfully and Workflow started!",
                "item": new_item,
                "workflow_run_id": glue_response['RunId']
            })
        }
    
    except Exception as e:
        # 예외 발생 시 에러 로그 및 메시지 반환
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Error processing data", "error": str(e)})
        }
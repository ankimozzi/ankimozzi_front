import json
import boto3

def lambda_handler(event, context):
    # DynamoDB 리소스 생성
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Ankkimozzi')

    # ProjectionExpression을 사용해 category 필드만 가져오기
    response = table.scan(
        ProjectionExpression="category"
    )

    # category 필드 추출
    categories = [item['category'] for item in response.get('Items', []) if 'category' in item]

    return {
        'statusCode': 200,
        'body': json.dumps(categories)
    }

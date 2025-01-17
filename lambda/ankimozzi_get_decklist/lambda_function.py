import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    query_params = event.get('queryStringParameters', {}) or {}
    category_name = query_params.get('category')

    # 디버깅 로그
    print("전체 이벤트:", json.dumps(event, indent=2))
    print("쿼리 파라미터:", query_params)
    print("category_name:", category_name)

    if not category_name:
        return {
            'statusCode': 400,
            'body': json.dumps({"error": "category parameter is missing in the query parameters"})
        }

    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('Ankkimozzi2')

        # KeyConditionExpression을 이용해 특정 category 값을 가진 아이템만 조회
        response = table.query(
            KeyConditionExpression=Key('category').eq(category_name)
        )

        # 결과 아이템
        items = response.get('Items', [])
        print("조회된 항목 수:", len(items))

        # 데이터를 새로운 형식으로 변환
        question_list = [
            {
                "question": item.get("question"),
                "url": item.get("url")
            } for item in items
        ]

        # 최종 응답 구조
        result = [
            {
                "category": category_name,
                "question_list": question_list
            }
        ]

        return {
            'statusCode': 200,
            'body': json.dumps(result)
        }

    except Exception as e:
        # 예외 처리 및 오류 반환
        print("에러 발생:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({"error": "An error occurred while querying the database", "message": str(e)}),
        }

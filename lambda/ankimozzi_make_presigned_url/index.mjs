import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3 클라이언트 초기화
const s3Client = new S3Client({ region: "us-west-1" }); // AWS 리전 설정

export const handler = async (event) => {
  try {
    // event가 API Gateway를 통해 왔는지 직접 테스트되었는지 확인
    let body;
    if (event.body) {
      // API Gateway를 통한 요청일 경우
      body =
        typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } else {
      // Lambda 테스트 이벤트일 경우
      body = event;
    }

    const { fileName } = body; // 파일 이름 전달

    if (!fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "File name is required" }),
      };
    }

    // Presigned URL 생성 파라미터
    const params = {
      Bucket: "ankkimozzi-video", // S3 버킷 이름
      Key: `${fileName}`, // 저장될 경로 및 파일 이름
      ContentType: "video/mp4", // 업로드 파일의 Content-Type
    };

    // PutObjectCommand 생성
    const command = new PutObjectCommand(params);

    // Presigned URL 생성
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // Presigned URL 반환
    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl }),
    };
  } catch (error) {
    console.error("Error generating Presigned URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

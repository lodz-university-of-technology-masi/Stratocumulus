CALL sam build
CALL sam package --output-template-file packaged.yaml --s3-bucket stratocumulus-recruiter-bucket
CALL aws cloudformation deploy --template-file packaged.yaml --stack-name recruiter-api --capabilities CAPABILITY_IAM
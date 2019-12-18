CALL sam build
CALL sam package --output-template-file packaged.yaml --s3-bucket stratocumulus-lambdas-bucket
CALL aws cloudformation deploy --template-file packaged.yaml --stack-name dynamodb-lambdas --capabilities CAPABILITY_IAM
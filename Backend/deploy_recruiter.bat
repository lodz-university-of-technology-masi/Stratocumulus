CALL sam build
CALL sam package --template-file recruiter_template.yaml --output-template-file recruiter_packaged.yaml --s3-bucket stratocumulus-lambdas-bucket
CALL aws cloudformation deploy --template-file recruiter_packaged.yaml --stack-name recruiter-api --capabilities CAPABILITY_IAM
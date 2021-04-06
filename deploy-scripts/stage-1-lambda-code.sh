# helper sh script to replace source code without recalling whole terraform and change the terraform state

zip -r -j lambda-output.zip dist-minified/index.js dist-minified/.env

aws lambda update-function-code \
    --function-name stage_1_node-graphql-boilerplate_be_service \
    --region eu-central-1 \
    --zip-file fileb://lambda-output.zip

rm lambda-output.zip
Minio Artifact setup;
1. Create an access key/secret in the minio UI at 
2. Save the key/secret as a secret in kubernetes in the workflows namespace
`kubectl create secret generic minio-credentials --namespace workflows --from-literal=accessKey='<key>' --from-literal=secretKey='<secret>`
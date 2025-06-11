$imageName = "user_service:0.0.1-SNAPSHOT"
$containerName = "user_service"

docker rm -f $containerName -ErrorAction SilentlyContinue

$imageId = docker images -q $imageName
if ($imageId) {
    docker rmi -f $imageId
}

.\mvnw spring-boot:build-image

docker run --name $containerName -p 8081:8081 -d $imageName


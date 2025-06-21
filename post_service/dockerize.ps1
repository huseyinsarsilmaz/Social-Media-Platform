$imageName = "post_service:0.0.1-SNAPSHOT"
$containerName = "post_service"

docker rm -f $containerName 2>$null

$imageId = docker images -q $imageName
if ($imageId) {
    docker rmi -f $imageId
}

.\mvnw spring-boot:build-image

docker run --name $containerName -p 8082:8082 -d $imageName


$imageName = "api-gateway:0.0.1-SNAPSHOT"
$containerName = "api-gateway"

docker rm -f $containerName 2>$null

$imageId = docker images -q $imageName
if ($imageId) {
    docker rmi -f $imageId
}

.\mvnw spring-boot:build-image

docker run --name $containerName -p 8080:8080 -d $imageName

$imageName = "feed_service:0.0.1-SNAPSHOT"
$containerName = "feed_service"

docker rm -f $containerName 2>$null

$imageId = docker images -q $imageName
if ($imageId) {
    docker rmi -f $imageId
}

.\mvnw spring-boot:build-image

docker run --name $containerName -p 8083:8083 -d $imageName


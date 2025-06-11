$imageName = "service_discovery:0.0.1-SNAPSHOT"
$containerName = "service_discovery"

docker rm -f $containerName -ErrorAction SilentlyContinue

$imageId = docker images -q $imageName
if ($imageId) {
    docker rmi -f $imageId
}

.\mvnw spring-boot:build-image

docker run --name $containerName -p 8761:8761 -d $imageName
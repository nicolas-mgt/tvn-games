REVISION := $(shell git rev-parse HEAD)
IMAGE := ghcr.io/nicolas-mgt/tvn-games:$(REVISION)

.PHONY: build push deploy

build:
	@test -z "$$(git status --porcelain)" || (echo "Commit changes before building"; exit 1)
	docker buildx build --platform linux/amd64 --load --label org.opencontainers.image.revision=$(REVISION) -t $(IMAGE) .

push:
	docker push --quiet $(IMAGE)
	@mkdir -p .state
	@docker inspect --format='{{index .RepoDigests 0}}' $(IMAGE) > .state/image.txt

deploy:
	python3 deploy/deploy.py

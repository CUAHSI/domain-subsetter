.DEFAULT_GOAL := all
isort = isort api tests
black = black -S -l 120 --target-version py38 api tests

.PHONY: up
up:
	docker-compose up

.PHONY: up-d
up-d:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: build
build:
	docker-compose build

.PHONY: test
test:
	docker-compose exec api pytest tests

.PHONY: format
format:
	docker-compose run api $(isort)
	docker-compose run api $(black)

.PHONY: test
test:
	docker-compose exec api pytest tests

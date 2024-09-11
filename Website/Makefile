all:
	@docker compose up --build 

clean:
	@docker compose down -v

fclean: clean
	docker system prune -af --volumes


re: fclean all
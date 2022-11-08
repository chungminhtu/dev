FROM rabbitmq:3.9.20-management-alpine

# Define environment variables.
ENV RABBITMQ_USER user
ENV RABBITMQ_PASSWORD user
ENV RABBITMQ_PID_FILE /var/lib/rabbitmq/mnesia/rabbitmq

ADD init/create-user.sh /create-user.sh
RUN chmod +x /create-user.sh

EXPOSE 15672
EXPOSE 5672

# Define default command
CMD ["/create-user.sh"]

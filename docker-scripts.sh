#!/bin/bash

# Docker Compose management script for Next.js app

case "$1" in
  "start")
    echo "Starting the application..."
    docker-compose up -d
    echo "Application started on http://localhost:3001"
    ;;
  "stop")
    echo "Stopping the application..."
    docker-compose down
    echo "Application stopped"
    ;;
  "restart")
    echo "Restarting the application..."
    docker-compose restart
    echo "Application restarted"
    ;;
  "logs")
    echo "Showing application logs..."
    docker-compose logs -f app
    ;;
  "build")
    echo "Building the application..."
    docker-compose build --no-cache
    echo "Build completed"
    ;;
  "status")
    echo "Checking application status..."
    docker-compose ps
    ;;
  "clean")
    echo "Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    echo "Cleanup completed"
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|build|status|clean}"
    echo ""
    echo "Commands:"
    echo "  start   - Start the application in detached mode"
    echo "  stop    - Stop the application"
    echo "  restart - Restart the application"
    echo "  logs    - Show application logs"
    echo "  build   - Rebuild the Docker image"
    echo "  status  - Show container status"
    echo "  clean   - Clean up Docker resources"
    exit 1
    ;;
esac 
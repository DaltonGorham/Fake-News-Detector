#!/bin/bash

set -e

RESULTS_FOLDER="tests/results"
mkdir -p "$RESULTS_FOLDER"

print_header() {
    echo "========================================"
    echo "  $1"
    echo "========================================"
    echo ""
}

print_success() {
    echo "[SUCCESS] $1"
}

print_info() {
    echo "[INFO] $1"
}

cd "$(dirname "$0")"

TEST_TYPE="${1#--}"
RESULTS_FILE="$RESULTS_FOLDER/${TEST_TYPE}_results.txt"

case "$1" in
    --local)
        print_header "Running Tests Against Local API"
        print_info "Target: http://localhost:8000"
        echo ""
        API_BASE_URL=http://localhost:8000 pytest tests/ -v -s --tb=short | tee "$RESULTS_FILE"
        ;;
    
    --production)
        print_header "Running Tests Against Production API"
        print_info "Target: https://fake-news-detector-dev-prod.onrender.com"
        echo ""
        pytest tests/ -v -s --tb=short | tee "$RESULTS_FILE"
        ;;
    
    --coverage)
        print_header "Generating Code Coverage Report"
        pytest tests/ -v --cov=src --cov-report=html --cov-report=term | tee "$RESULTS_FILE"
        echo ""
        print_success "Coverage report: htmlcov/index.html"
        ;;
    
    --performance)
        print_header "API Performance Tests"
        pytest tests/test_api_performance.py -v -s --tb=no | tee "$RESULTS_FILE"
        ;;
    
    --unit)
        print_header "Unit Tests"
        pytest tests/test_article_service.py tests/test_user_service.py tests/test_article_repository.py -v -s --tb=short | tee "$RESULTS_FILE"
        ;;
    
    --routes)
        print_header "Route Tests"
        pytest tests/test_article_routes.py tests/test_user_routes.py -v -s --tb=short | tee "$RESULTS_FILE"
        ;;
    
    --repository)
        print_header "Repository Tests"
        pytest tests/test_article_repository.py -v -s --tb=short | tee "$RESULTS_FILE"
        ;;
    
    --quick)
        print_header "Quick Test Run"
        pytest tests/ -v --tb=line -q | tee "$RESULTS_FILE"
        ;;
    
    *)
        print_header "Backend Test Suite"
        echo "Usage: ./run_tests.sh [option]"
        echo ""
        echo "Options:"
        echo "  --local         Test against localhost:8000"
        echo "  --production    Test against production (default)"
        echo "  --performance   Run API performance tests only"
        echo "  --unit          Run unit tests (services and repositories)"
        echo "  --routes        Run route integration tests"
        echo "  --repository    Run repository tests only"
        echo "  --coverage      Generate coverage report"
        echo "  --quick         Fast test run with minimal output"
        echo ""
        echo "Examples:"
        echo "  ./run_tests.sh --production"
        echo "  ./run_tests.sh --local"
        echo "  ./run_tests.sh --coverage"
        ;;
esac

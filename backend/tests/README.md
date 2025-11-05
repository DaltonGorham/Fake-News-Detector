# Backend Testing Setup

This directory contains all tests for the backend API.

## Running Tests

### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Run the Test Script

Run `./run_tests.sh` with any of the following arguments:

- `--unit` - Run service and repository tests 
- `--routes` - Run HTTP endpoint tests 
- `--repository` - Run database layer tests only 
- `--performance` - Run API timing tests against production 
- `--local` - Test against localhost:8000
- `--production` - Test against production 
- `--coverage` - Generate HTML coverage report
- `--quick` - Fast test run with minimal output
- (no argument) - Run all tests

### Examples

```bash
./run_tests.sh --unit
./run_tests.sh --coverage
./run_tests.sh --performance
```

Test results are saved to `tests/results/`.
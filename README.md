# Advanced Load Testing Suite with Artillery

A comprehensive load testing solution featuring a full-featured e-commerce API and advanced performance testing scenarios using Artillery.

## 🚀 Features

### Test Application
- **Full E-commerce API**: Complete REST API with authentication, products, cart, orders, and analytics
- **Realistic Data**: 1,000 products and 100 users pre-loaded for testing
- **Authentication System**: JWT-based auth with bcrypt password hashing
- **Performance Simulation**: Configurable response delays to simulate real-world conditions

### Load Testing Scenarios
- **Load Test**: Gradual ramp-up testing normal to peak loads (5-50 users/sec)
- **Stress Test**: High concurrency testing to find breaking points (up to 400 users/sec)
- **Spike Test**: Sudden traffic spikes to test system resilience (up to 2000 users/sec)
- **Endurance Test**: 30-minute sustained load testing for stability

### User Journey Simulation
- **Registration & Shopping Flow** (40% weight)
- **Login & Purchase Flow** (35% weight)
- **Product Search & Browse** (20% weight)
- **Analytics Dashboard Access** (5% weight)

## 📊 Performance Metrics

The testing suite measures:
- **Response Times**: Average, 95th percentile, and max response times
- **Throughput**: Requests per second and concurrent users
- **Error Rates**: Failed requests and error distribution
- **Resource Usage**: Memory and CPU utilization
- **Endpoint Performance**: Per-endpoint performance breakdown

## 🛠 Setup & Usage

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Test Server
```bash
npm run server
```
The server will start on port 3001 with sample data loaded.

### 3. Run Load Tests

#### Individual Tests
```bash
# Standard load test (7 minutes)
npm run test:load

# Stress test (7.5 minutes) 
npm run test:stress

# Spike test (2.5 minutes)
npm run test:spike

# Endurance test (30 minutes)
npm run test:endurance
```

#### All Tests
```bash
npm run test:all
```

#### Combined Server + Tests
```bash
npm run start:test-server
```

### 4. View Results
- Real-time metrics in terminal during test execution
- HTML reports generated in `reports/` directory
- JSON results for programmatic analysis

## 📋 Test Configuration

### Load Test Phases
1. **Warm up** (60s): 5 users/sec - System initialization
2. **Normal load** (120s): 20 users/sec - Typical traffic
3. **Peak load** (180s): 50 users/sec - High traffic periods
4. **Cool down** (60s): 10 users/sec - Traffic reduction

### Stress Test Phases
1. **Baseline** (30s): 10 users/sec
2. **Stress Level 1** (60s): 100 users/sec
3. **Stress Level 2** (120s): 200 users/sec
4. **Breaking Point** (180s): 400 users/sec
5. **Recovery** (60s): 50 users/sec

### API Endpoints Tested
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/products` - Product listing with pagination/filtering
- `GET /api/products/:id` - Individual product details
- `GET /api/cart` - Shopping cart retrieval
- `POST /api/cart` - Add items to cart
- `POST /api/orders` - Order creation
- `GET /api/orders` - Order history
- `GET /api/analytics` - Performance analytics
- `GET /health` - Health check

## 📈 Performance Analysis

### Key Performance Indicators (KPIs)
- **Response Time**: Target < 200ms for product endpoints
- **Throughput**: Minimum 1000 RPS for read operations
- **Error Rate**: Maximum 1% under normal load
- **Availability**: 99.9% uptime under sustained load

### Bottleneck Identification
The test suite helps identify:
- Database query performance issues
- Authentication overhead
- Memory leaks during sustained load
- Connection pool exhaustion
- CPU-intensive operations

### Scalability Insights
- **Horizontal scaling** readiness assessment
- **Vertical scaling** resource requirements
- **Caching** strategy effectiveness
- **Load balancer** configuration optimization

## 🔧 Customization

### Modifying Test Scenarios
Edit YAML files in `tests/` directory:
- Adjust arrival rates and durations
- Add new user journeys
- Modify request payloads
- Configure custom assertions

### Adding New Endpoints
1. Implement endpoints in `server/index.js`
2. Add test scenarios in YAML files
3. Update test weights and flows

### Custom Metrics
Extend `test-functions.js` for:
- Custom response validation
- Business-specific metrics
- Advanced user simulation

## 📊 Sample Performance Report

```
Load Test Results Summary
========================
Duration: 7 minutes
Total Requests: 45,678
Successful Requests: 45,234 (99.03%)
Failed Requests: 444 (0.97%)
Average Response Time: 127ms
95th Percentile: 285ms
Peak Throughput: 1,247 RPS
Concurrent Users: 850

Top Performing Endpoints:
1. GET /health - 45ms avg
2. GET /api/products - 89ms avg
3. POST /api/auth/login - 156ms avg

Performance Issues:
1. GET /api/analytics - 1.2s avg (optimization needed)
2. POST /api/orders - High error rate under stress
```

## 🚨 Monitoring & Alerts

### Performance Thresholds
- **Warning**: Response time > 500ms
- **Critical**: Error rate > 5%
- **Alert**: Throughput drop > 30%

### Health Checks
Continuous monitoring of:
- Server availability
- Database connections
- Memory usage
- Response time trends

## 🎯 Best Practices

### Test Environment
- Use dedicated test infrastructure
- Match production hardware specs
- Include realistic data volumes
- Test with production-like network conditions

### Test Execution
- Warm up systems before testing
- Run tests during off-peak hours
- Monitor system resources during tests
- Compare results across test runs

### Result Analysis
- Focus on percentiles, not just averages
- Identify performance degradation patterns
- Correlate errors with load levels
- Plan capacity based on business growth

## 📚 Advanced Features

### Custom Artillery Plugins
- Metrics aggregation by endpoint
- Real-time performance monitoring
- Custom assertion validation
- Advanced reporting formats

### Integration Capabilities
- CI/CD pipeline integration
- Performance regression detection
- Automated alerting systems
- Historical trend analysis

This comprehensive load testing suite provides enterprise-grade performance testing capabilities for modern web applications, ensuring your system can handle production traffic with confidence.
module.exports = {
  ci: {
    collect: { numberOfRuns: 3, url: ['http://localhost:3000/', 'http://localhost:3000/plans', 'http://localhost:3000/exams'] },
    assert: {
      assertions: {
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
  },
};

const gt = require('google-trends-api'); gt.relatedQueries({geo: 'BR', category: 44}).then(console.log).catch(console.error);  

import http from 'k6/http';
import { Rate } from 'k6/metrics';
import { sleep } from 'k6';

let errorRate = new Rate('error_rate');

export let options = {
    stages: [
        // { duration: '3m', target: 10, rps: 10},
        // { duration: '3m', target: 100, rps: 100},
        { duration: '3m', target: 1000, rps: 1000}
    ],
    thresholds: {
        'failed requests': ['rate<0.1']
    }
};

export default () => {
    let productId = Math.floor(Math.random() * (5999999 - 5399999) + 5399999);
    let users = [
        'brockObama', 'KanyeEast', 'past', 
        'bigJon', 'theMnth', 'daGrownUp', 'A$AP_Bullwinkle', 'Tyler_the_destroyer'
      ];

    let headings = [
        'I hate this product', 'I love this product', 'idk', 'its okay', 'Meh'
      ];

    let text = 'Eos eu illum dicit iuvaret, te vim fuisset antiopam, debet erant eruditi quo eu. Eu invenire gubergren sit, eu quo.';

    let rating = Math.floor(Math.random() * (5-1) + 1);

    let reviewRes = http.get(`http://localhost:3000/api/reviews/${productId}`);
    // let summaryRes = http.get(`http://localhost:3000/api/reviews/${productId}/summary`);
    let postRes = http.post('http://localhost:3001/api/reviews/add-review', {product_id: productId, username: users[Math.floor(Math.random*users.length)], review_heading: headings[Math.floor(Math.random*headings.length)], review_text: text, review_rating: rating});

    errorRate.add(reviewRes.status != 200);
    // errorRate.add(summaryRes.status != 200);
    errorRate.add(postRes.status != 200);
    sleep(1);
}
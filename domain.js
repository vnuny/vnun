import https from 'https';
async function domain() {
    const domains = ["https://force3emaa.shop",
        "https://ce1amea1.shop",
        "https://c1e2for3maa.shop/",
        "https://ce9m9maa.shop",
        "https://g1hc2em13a.shop",
        "https://sitec2e2m2a.shop/",
        "https://vce2m2m2a.shop/",
        "https://vc1em3m4a.shop/",
        "https://bc45em1ma.shop/",
        "https://bc6em2maa.shop/"];
    let successDomain;
    

    for (let i = 0; i < domains.length; i++) {
        try {
            const dom = await new Promise((resolve, reject) => {
                https.get(domains[i], (response) => {
                    let data = '';

                    response.on('data', (chunk) => {
                        data += chunk;
                    });

                    response.on('end', () => {
                        resolve(data);
                    });

                }).on('error', (error) => {
                    reject(error);
                });
            });
            if (dom.length > 0) {
                successDomain = domains[i];
                console.log(successDomain);
                break;
            }
        } catch (err) {
            continue;
        }
    }
    return successDomain;
}
export default domain;


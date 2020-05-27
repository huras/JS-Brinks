var url = 'http://xxx.domain.com';
let lala = /[^.]+/.exec(url)[0].substr(7);

let urls = [
    'http://localhost:8000/public/file/202002191659373.pdf',
    'http://gedunicooper.hostsol.com.br/public/file/202002191659373.pdf',
    'http://gedunicooper.com.br/public/file/202002191659373.pdf'
];

let regex = /https?:\/\/.*(\/public.*)/;

urls.map(item => {
    let res = regex.exec(item)[1];
    console.log(res);
})


const express= require('express');
const app = express();

app.use(express.static('./dist/Canvas-on-Angular'));
app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: './dist/Canvas-on-Angular'});
});
app.listen(process.env.PORT || 8080);

import app from 'flarum/admin/app';
export { default as extend } from './src/admin/extend';

app.initializers.add('forumaker-bento', () => {});

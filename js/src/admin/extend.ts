import Extend from 'flarum/common/extenders';
import BentoSettingsPage from './components/BentoSettingsPage';

export default [
  new Extend.Admin().page(BentoSettingsPage),
];

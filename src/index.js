import ReactDOM from 'react-dom';
import './styles/index.css';
import jsx from './App';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';

import 'react-sound';
soundManager.setup({ ignoreMobileRestrictions : true });

ReactDOM.render(jsx, document.getElementById('root'));
registerServiceWorker();

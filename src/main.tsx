import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.scss';
import store from '@/stores';
import App from './App';

const text = `
               aaaa                 ppppppppppppp        tttttttttttttttttttt      xxxxx        xxxxxx
              aa   aa               pp         ppp       ttt     ttt      ttt         xxx      xxxx
             aa     aa              pp          ppp              ttt                    xx    xx
            aa       aa             pp          ppp              ttt                     xx  xx 
           aa         aa            pp        ppp                ttt                      xxxx 
          aaaaaaaaaaa aaa           ppppppppppp                  ttt                     xx  xx
         aa             aa          pp                           ttt                    xx    xx
        aa               aa         pp                           ttt                   xx      xxx
       aa                aaa        pp                           ttt                 xxx        xxxxx
      aaa                 aaa       pp                           ttt               xxxx           xxxxxx

      --- Admin Template
`;

// eslint-disable-next-line no-console
console.log(text);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);

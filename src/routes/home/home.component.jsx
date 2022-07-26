/** 告知这个component在哪里附加nested component；
 * 例如，这个component对应的route是 /home
 * 我们还需要在/home的情况下render一个/home/shop
 */
import { Outlet } from 'react-router-dom';
import Directory from '../../components/directory/directory.component';

const Home = () => {

  return (
    <div>
      <Directory />
      <Outlet /> 
    </div>
    
  );
};

export default Home;

// {/* 这样子的话 shop compnent 将在 Directory component 上面渲染  */} 这个失效了，有空可以去寻找为何
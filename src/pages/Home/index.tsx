import ALoader from '@/components/common/ALoader';
import APanel from '@/components/snippets/APanel';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { homeApi } from '@/api';
import { handleResult } from '@/utils';
import './index.scss';
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core';

// Import bar charts, all suffixed with Chart
import { BarChart, LineChart } from 'echarts/charts';

// Import the tooltip, title, rectangular coordinate system, dataset and transform components
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';

// Features like Universal Transition and Label Layout
import { LabelLayout, UniversalTransition } from 'echarts/features';

// Import the Canvas renderer
// Note that including the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers';
import { formatTime } from '@/utils/tools';
import useQuery from '@/hooks/useQuery';

// Register the required components
echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart,
]);

type ChartOptions = {
  xData?: string[];
  yData?: number[];
};

// let timer: any = null

const Home: React.FC<any> = () => {
  const [currentActiveUsers, setCurrentActiveUsers] = useState<UserListItem[]>([]);
  const dauChart = useRef<any>();
  const mauChart = useRef<any>();

  // useEffect(() => {
  //   timer = setInterval(() => {
  //     queryCurrentActiveUsers()
  //   }, 5000)
  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [])

  useEffect(() => {
    queryCurrentActiveUsers();
    initDiagram();
  }, []);

  const queryCurrentActiveUsers = async () => {
    const res = await homeApi.getCurrentActiveUsers();
    if (handleResult(res)) {
      setCurrentActiveUsers(res.data!.users);
    }
  };

  // 图表数据请求
  const {
    query: queryMonthlyActiveUsers,
    data: mauData,
    isLoading: isLoadingMau,
  } = useQuery(homeApi.getMonthlyActiveUsers);
  const mau = useMemo(() => mauData?.mau, [mauData]);

  const {
    query: queryDailyActiveUsers,
    data: dauData,
    isLoading: isLoadingDau,
  } = useQuery(homeApi.getDailyActiveUsers);
  const dau = useMemo(() => dauData?.dau, [dauData]);

  const dauOptions = useMemo(() => {
    if (!dau) return {};
    const xData = dau.map(([ts, total]) => {
      return formatTime(ts * 1000, 'MM-DD');
    });
    const yData = dau.map(([ts, total]) => total);
    return {
      xData,
      yData,
    };
  }, [dauData]);

  const mauOptions = useMemo(() => {
    if (!mau) return {};
    const xData = mau.map(([ts, total]) => {
      return formatTime(ts * 1000, 'M') + '月';
    });
    const yData = mau.map(([ts, total]) => total);
    return {
      xData,
      yData,
    };
  }, [mau]);

  const initDau = (dauOptions: ChartOptions) => {
    if (!dauChart.current) dauChart.current = echarts.init(document.getElementById('daily-active-user') as HTMLElement);
    dauChart.current.setOption({
      xAxis: {
        type: 'category',
        data: dauOptions.xData,
      },
      yAxis: {
        type: 'value',
        splitLine: { show: false },
      },
      series: [
        {
          data: dauOptions.yData,
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize: 10,
            },
          },
          symbol: 'none',
          stack: 'a',
          areaStyle: {
            normal: {},
          },
        },
      ],
    });
  };

  const initMau = (mauOptions: ChartOptions) => {
    if (!mauChart.current)
      mauChart.current = echarts.init(document.getElementById('monthly-active-user') as HTMLElement);
    mauChart.current.setOption({
      xAxis: {
        type: 'category',
        data: mauOptions.xData,
      },
      yAxis: {
        type: 'value',
        splitLine: { show: false },
      },
      series: [
        {
          data: mauOptions.yData,
          type: 'line',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize: 10,
            },
          },
          symbol: 'none',
          stack: 'a',
          areaStyle: {
            normal: {},
          },
        },
      ],
    });
  };

  useEffect(() => {
    if (!dauChart.current) initDau(dauOptions);
    else {
      dauChart.current.setOption({
        xAxis: {
          data: dauOptions.xData,
        },
        series: [
          {
            data: dauOptions.yData,
          },
        ],
      });
    }
  }, [dauOptions, dau]);

  useEffect(() => {
    if (!mauChart.current) initMau(mauOptions);
    else {
      mauChart.current.setOption({
        xAxis: {
          data: mauOptions.xData,
        },
        series: [
          {
            data: mauOptions.yData,
          },
        ],
      });
    }
  }, [mauOptions, mau]);

  const isLoading = useMemo(() => isLoadingDau || isLoadingMau, [isLoadingDau, isLoadingMau]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const resize = useCallback(() => {
    if (dauChart.current) dauChart.current.resize();
    if (mauChart.current) mauChart.current.resize();
  }, [dauChart, mauChart, dauOptions, mauOptions]);

  const initDiagram = () => {
    queryDailyActiveUsers();
    queryCurrentActiveUsers();
    queryMonthlyActiveUsers();
  };

  return (
    <div className='home-page'>
      {isLoading && <ALoader size='large' />}

      <div>
        <APanel title='当前在线用户'>
          <div className='user-list'>
            <span className='count'>{currentActiveUsers.length} 人</span>
          </div>
        </APanel>
        <APanel title='过去一周日活'>
          <div id='daily-active-user' className='graph' />
        </APanel>
        <APanel title='过去半年月活'>
          <div id='monthly-active-user' className='graph' />
        </APanel>
      </div>
    </div>
  );
};

export default Home;

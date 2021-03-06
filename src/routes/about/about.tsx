import { default as React } from 'react';
import { mapStateToProps, AppStore } from '../../store';
import { connect } from 'react-redux';
import { updateTitle } from '../../store/title.store';
import { WithStyles, createStyles, withStyles } from '@material-ui/styles';

const styles = () => createStyles({
  container: {
    width: 600,
    margin: '24px auto',
  },
});

interface PaymentDialogProps extends WithStyles<typeof styles> { }

class About extends React.Component<AppStore & PaymentDialogProps> {
  componentWillMount = () => {
    const title = '关于';
    this.props.updateTitle(title);
    document.title = `${ title } | 躲猫猫`;
  }
  render() {
    const { classes } = this.props;
    return <div className={ classes.container }>
      <h1>php-dmm-netgame-web</h1>

      <h2>可能会有的问题以及解答</h2>
      <p>问: 提示对DMM输入了错误的数据?</p>
      <p>答: 如果刷新页面/重新登陆无效, 请尝试在设置页面清除Cookies并重新登陆</p>
      <p>问: 完善不了账号信息/无法购买课金道具?</p>
      <p>答: 这部分功能尚未经过完整测试, 请将具体联系方式回复至贴吧以协助开发(谨慎起见不提供链接)</p>

      <h2>关于这个特制的React版本</h2>

      <p>为了证明自己的实力, 挑战自己学习能力和工作压力的极限, 测试新的日常编码思想, 启动了这个项目, 最长连续奋斗21小时, 勉强达成自己的心愿(原预订一天内完成, 由于诸多问题干扰, 导致制作时间远超预期)</p>

      <h2>php-dmm-netgame-web-react</h2>
      <p>项目启动时间: 2019-07-28 20:00 CST</p>
      <p>初版竣工时间: 2019-07-31 07:00 CST</p>
      <p>历经难关:</p>
      <ul>
        <li><del>Next.js</del>(从入门到放弃)</li>
        <li>React 16</li>
        <li>React Router</li>
        <li>React Redux</li>
        <li>@types/react</li>
        <li>Material UI</li>
        <li>地球OL</li>
        <li>各位HR</li>
      </ul>

      <h2>php-dmm-netgame-web-angular</h2>
      <p>项目启动日期: 2019-06-26</p>
      <p>初版竣工日期: 2019-07-11</p>
      <p>历经难关:</p>
      <ul>
        <li>Angular 8</li>
        <li>Angular Material</li>
        <li>DMM RPC</li>
        <li>样本收集(失败告终)</li>
        <li>域名注册</li>
        <li>功能测试</li>
        <li>地球OL</li>
      </ul>

      <h2>php-dmm-netgame-web-aurelia</h2>
      <p>项目启动日期: 2019-06-08</p>
      <p>初版竣工日期: 2019-06-24</p>
      <p>历经难关:</p>
      <ul>
        <li>PHP</li>
        <li>Composer</li>
        <li>GuzzleHTTP</li>
        <li>DMM多方法登录</li>
        <li>Cookies转发</li>
        <li>DMM双站点同时登陆</li>
        <li>DMM返回结果解析</li>
        <li>Aurelia</li>
        <li>TypeScript</li>
        <li>Material Components Web</li>
        <li>舰队collection 2019年 春季活动</li>
        <li>地球OL</li>
      </ul>

      <p>玩的愉快 :)</p>
    </div>;
  }
}

export default connect(
  mapStateToProps,
  { updateTitle },
)(withStyles(styles)(About));

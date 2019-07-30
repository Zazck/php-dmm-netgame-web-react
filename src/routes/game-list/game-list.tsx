import { default as React } from 'react';
import { AppStore, mapStateToProps } from '../../store';
import { updateTitle } from '../../store/title.store';
import { updateGeneralGameList, updateAdultGameList } from '../../store/game-list.store';
import { connect } from 'react-redux';
import { withStyles, WithStyles, Theme, createStyles, Tabs, Tab } from '@material-ui/core';
import { SettingService } from '../../services/setting.service';
import { IGameInfo } from '../../types/dmm';
import { default as GameCard } from '../../components/game-card/game-card';
import { LocalFlorist, LocalBar } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
  cardList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 600px)',
    gridGap: '12px',
    margin: '12px',
    padding: 0,
    justifyContent: 'center',
  },
});

interface GameListProps extends WithStyles<typeof styles> {}

interface GameListState {
  category: 0 | 1;
  gameCategory: 0 | 1;
}

class GameList extends React.Component<AppStore & GameListProps, GameListState> {
  componentWillMount = () => {
    const title = '游戏列表';
    this.props.updateTitle(title);
    document.title = `${ title } | 躲猫猫`;
    this.getList();
  }

  public async fetchList(category: 'general' | 'adult'): Promise<IGameInfo[]> {
    const response = await fetch(`/static/${category}.json`)
      .catch(_ => new Response('[]'));
    return await response.json() as IGameInfo[];
  }

  public getList = async () => {
    if (this.props.gameListState.general.length === 0) {
      const general = this.fetchList('general');
      this.props.updateGeneralGameList(await general);
    }
    if (SettingService.category === 'exchange') {
      if (this.props.gameListState.adult.length === 0) {
        const adult = this.fetchList('adult');
        this.props.updateAdultGameList(await adult);
      }
    }
  }

  constructor(props: any) {
    super(props);
    this.state = {
      category: SettingService.category === 'exchange' ? 1 : 0,
      gameCategory: SettingService.category === 'exchange' ? (SettingService.gameCategory === 'general' ? 0 : 1) : 0,
    };
  }

  public makeQueryString(name: string, category: 'general' | 'adult') {
    const search = new URLSearchParams();
    search.append('name', name);
    search.append('category', category);
    return {
      pathname: '/',
      search: `?${search.toString()}`,
    };
  }

  render() {
    const { classes, gameListState } = this.props;
    return <div>
      {
        this.state.category && <Tabs
          value={this.state.gameCategory}
          onChange={ (_, value) => this.setState({ ...this.state, gameCategory: value }) }
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="全年龄" icon={<LocalFlorist />} />
          <Tab label="成人向" icon={<LocalBar />} />
        </Tabs>
      }
      {<div>
        <div hidden={this.state.gameCategory ? true : false}>
          <div className={ classes.cardList } >
            {
              gameListState.general.map((info) => {
                return <GameCard
                  title={ info.title }
                  image={ `https://img-freegames.dmm.com/app/${info.thumb}/details/pic_thmb.jpg` }
                  description={ info.comment }
                  to={ this.makeQueryString(info.name, 'general') }
                  key={ info.name }
                ></GameCard>;
              })
            }
          </div>
        </div>
        {this.state.category && <div hidden={!this.state.gameCategory ? true : false}>
          <div className={ classes.cardList } >
            {
              gameListState.adult.map((info) => {
                return <GameCard
                  title={ info.title }
                  image={ `https://img-freegames.dmm.com/app/${info.thumb}/details/pic_thmb.jpg` }
                  description={ info.comment }
                  to={ this.makeQueryString(info.name, 'adult') }
                  key={ info.name }
                ></GameCard>;
              })
            }
          </div>
        </div>}
      </div>}
    </div>;
  }
}

export default connect(
  mapStateToProps,
  { updateTitle, updateGeneralGameList, updateAdultGameList },
)(withStyles(styles)(GameList));

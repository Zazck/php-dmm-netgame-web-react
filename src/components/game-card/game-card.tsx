import { default as React } from 'react';
import { withStyles, WithStyles, Theme, createStyles, Card, CardMedia, CardContent, Typography, ButtonBase } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { LocationDescriptor } from 'history';

const styles = (theme: Theme) => createStyles({
  button: {
    width: '100%',
  },
  card: {
    display: 'flex',
    width: '100%',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    paddingBottom: '0 !important',
  },
  cover: {
    width: 164,
    height: 90,
  },
  link: {
    color: 'initial',
    textDecoration: 'none',
  },
});

interface GameCardProps extends WithStyles<typeof styles> {
  to: LocationDescriptor;
  image: string;
  title: string;
  description: string;
}

class GameCard extends React.Component<GameCardProps, never> {
  render() {
    const { classes } = this.props;
    return <div>
      {
      <Link to={ this.props.to } className={ classes.link }>
        <ButtonBase component="div" className={ classes.button }>
          <Card className={ classes.card }>
            <CardMedia
              className={ classes.cover }
              image={ this.props.image }
              title={ this.props.title }
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h6" variant="h6">
                  { this.props.title }
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  { this.props.description }
                </Typography>
              </CardContent>
            </div>
          </Card>
        </ButtonBase>
      </Link>
      }
    </div>;
  }
}

export default withStyles(styles)(GameCard);

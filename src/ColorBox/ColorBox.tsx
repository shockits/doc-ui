import styled from '@emotion/styled';
import React, { Component } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { FiRefreshCw } from 'react-icons/fi';
import { getRgb, hexToRgb, rgbToHsl } from './utils/color-conversions';
import constructTheme from '../toolkit/constructTheme';
import defaultStyles from './styles';

interface Props {
  name: string;
  hex: string;
  readonly withStyles?: object;
  styles?: object;
}

interface State {
  clicks: number;
  value: string;
}

const Wrapper = styled.div`
  ${p => p.theme.mq(p.theme.wrapper)};
`;

const Triangle = styled.div`
  ${p => p.theme.mq(p.theme.triangle)};

  border-color: transparent ${p => p.color} transparent transparent;
`;

const Text = styled.div`
  ${p => p.theme.mq(p.theme.text)};
`;

const Icon = styled.div`
  ${p => p.theme.mq(p.theme.icon)};
`;

const ColorValue = styled.div`
  ${p => p.theme.mq(p.theme.colorValue)};
`;

const Name = styled.div`
  ${p => p.theme.mq(p.theme.name)};
`;

class ColorBox extends Component<Props, State> {
  public static defaultProps = {
    hex: '',
    name: '',
  };

  private static isValidHex = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;

  public readonly state = {
    clicks: 1,
    value: this.props.hex,
  };

  public componentDidUpdate(prevProps: Props) {
    const { hex } = this.props;

    if (hex !== prevProps.hex && ColorBox.isValidHex.test(hex)) {
      this.setState({ value: hex, clicks: 1 });
    }
  }

  public render() {
    const { name, withStyles, styles } = this.props;
    const { value } = this.state;

    const componentTheme = () =>
      constructTheme(defaultStyles, withStyles, styles);
    return (
      <ThemeProvider theme={componentTheme}>
        <Wrapper>
          <Triangle color={value} />
          <Text onClick={this.cycleValues}>
            <Icon>
              <FiRefreshCw />
            </Icon>
            <ColorValue>{value}</ColorValue>
            <Name>{name}</Name>
          </Text>
        </Wrapper>
      </ThemeProvider>
    );
  }

  private cycleValues = () => {
    const { hex } = this.props;
    const { clicks } = this.state;
    const clickCycle = clicks % 3;
    const [r, g, b] = getRgb(hex);

    this.setState(
      {
        clicks: clicks + 1,
      },
      () => {
        switch (clickCycle) {
          case 1:
            return this.setState({
              value: hexToRgb(hex),
            });
          case 2:
            return this.setState({
              value: rgbToHsl(r, g, b),
            });
          default:
            return this.setState({
              value: this.props.hex,
            });
        }
      }
    );
  };
}

export default ColorBox;

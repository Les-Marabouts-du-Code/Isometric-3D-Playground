import React, { useState } from 'react';
import {
  ChromePicker,
  Color,
  ColorChangeHandler,
  HuePicker
} from 'react-color';
import {
  Paper,
  makeStyles,
  Button,
  ButtonBase,
  Typography,
  Container,
  IconButton,
  Box
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
export interface IOptionSelectorProps {
  onHighColorChange: ColorChangeHandler;
  onLowColorChange: ColorChangeHandler;
}

const useStyles = makeStyles({
  optionSelector: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    background: '#fff',
    transition: 'width .2s ease-in-out, height .2s ease-in-out',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  optionSelectorClosed: {
    width: 60,
    height: 32
  },
  optionSelectorOpen: {
    width: 470
  },
  menuButton: {
    flex: 1
  },
  popOver: {
    position: 'absolute',
    zIndex: 2,
    bottom: 60
  },
  cover: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});

const OptionSelector = (props: IOptionSelectorProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [highColorPickerOpen, setHighColorPickerOpen] = useState(false);
  const [lowColorPickerOpen, setLowColorPickerOpen] = useState(false);
  function openMenu() {
    setOpen(true);
  }

  function toggleMenu() {
    setOpen(!open);
  }

  function toggleHighColorPicker() {
    setHighColorPickerOpen(!highColorPickerOpen);
  }
  function toggleLowColorPicker() {
    setLowColorPickerOpen(!lowColorPickerOpen);
  }
  function closeMenu() {
    setOpen(false);
  }
  function getHighColor(): string {
    const color = localStorage.getItem('isp_highColor');
    if (color) {
      return color;
    } else {
      return '#fff';
    }
  }
  function getLowColor(): string {
    const color = localStorage.getItem('isp_lowColor');
    if (color) {
      return color;
    } else {
      return '#fff';
    }
  }
  return (
    <Paper
      className={clsx(
        classes.optionSelector,
        open && classes.optionSelectorOpen,
        !open && classes.optionSelectorClosed
      )}
    >
      {open ? (
        <>
          <>
            <Button
              onClick={() => {
                toggleHighColorPicker();
              }}
            >
              Couleur Haute
            </Button>
            {highColorPickerOpen ? (
              <div className={classes.popOver}>
                <div
                  className={classes.cover}
                  onClick={toggleHighColorPicker}
                />
                <ChromePicker
                  onChangeComplete={props.onHighColorChange}
                  color={getHighColor()}
                />
              </div>
            ) : null}
          </>
          <>
            <Button
              onClick={() => {
                toggleLowColorPicker();
              }}
            >
              Couleur Basse
            </Button>
            {lowColorPickerOpen ? (
              <div className={classes.popOver}>
                <div className={classes.cover} onClick={toggleLowColorPicker} />
                <ChromePicker
                  onChangeComplete={props.onLowColorChange}
                  color={getLowColor()}
                />
              </div>
            ) : null}
          </>
          <IconButton
            aria-label="delete"
            onClick={event => {
              event.stopPropagation();
              closeMenu();
            }}
          >
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <ButtonBase
          focusRipple
          // className={classes.optionSelectorClosed}
          disableRipple={open}
          onClick={event => {
            event.stopPropagation();
            openMenu();
          }}
          className={classes.menuButton}
        >
          <Typography>Menu</Typography>
        </ButtonBase>
      )}
    </Paper>
  );
};
export default OptionSelector;

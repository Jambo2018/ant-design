// deps-lint-skip-all
import {
  GenerateStyle,
  resetComponent,
  FullToken,
  genComponentStyleHook,
  mergeToken,
  roundedArrow,
} from '../../_util/theme';
import {
  initSlideMotion,
  slideUpIn,
  slideUpOut,
  slideDownIn,
  slideDownOut,
} from '../../style/motion';
import genButtonStyle from './button';
import genStatusStyle from './status';

export interface ComponentToken {
  zIndexDropdown: number;
}

export interface DropdownToken extends FullToken<'Dropdown'> {
  rootPrefixCls: string;
  dropdownArrowDistance: number;
  dropdownArrowOffset: number;
  dropdownPaddingVertical: number;
  dropdownEdgeChildVerticalPadding: number;
  menuCls: string;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<DropdownToken> = token => {
  const {
    rootPrefixCls,
    componentCls,
    menuCls,
    zIndexDropdown,
    dropdownArrowDistance,
    dropdownArrowOffset,
    sizePopupArrow,
    antCls,
    iconCls,
    colorBgComponent,
    motionDurationMid,
    motionDurationSlow,
    dropdownPaddingVertical,
    fontSizeBase,
    dropdownEdgeChildVerticalPadding,
    radiusBase,
    colorTextDisabled,
    fontSizeIcon,
    controlPaddingHorizontal,
  } = token;

  return [
    {
      [componentCls]: {
        ...resetComponent(token),

        position: 'absolute',
        top: -9999,
        left: {
          _skip_check_: true,
          value: -9999,
        },
        zIndex: zIndexDropdown,
        display: 'block',

        // A placeholder out of dropdown visible range to avoid close when user moving
        '&::before': {
          position: 'absolute',
          insetBlock: -dropdownArrowDistance + sizePopupArrow,
          // insetInlineStart: -7, // FIXME: Seems not work for hidden element
          zIndex: -9999,
          opacity: 0.0001,
          content: '""',
        },

        [`${componentCls}-wrap`]: {
          position: 'relative',

          [`${antCls}-btn > ${iconCls}-down`]: {
            fontSize: fontSizeIcon,
          },

          [`${iconCls}-down::before`]: {
            transition: `transform ${motionDurationMid}`,
          },
        },

        [`${componentCls}-wrap-open`]: {
          [`${iconCls}-down::before`]: {
            transform: `rotate(180deg)`,
          },
        },

        [`
        &-hidden,
        &-menu-hidden,
        &-menu-submenu-hidden
      `]: {
          display: 'none',
        },

        // =============================================================
        // ==                          Arrow                          ==
        // =============================================================
        // Offset the popover to account for the dropdown arrow
        [`
        &-show-arrow&-placement-topLeft,
        &-show-arrow&-placement-top,
        &-show-arrow&-placement-topRight
      `]: {
          paddingBottom: dropdownArrowDistance,
        },

        [`
        &-show-arrow&-placement-bottomLeft,
        &-show-arrow&-placement-bottom,
        &-show-arrow&-placement-bottomRight
      `]: {
          paddingTop: dropdownArrowDistance,
        },

        // Note: .popover-arrow is outer, .popover-arrow:after is inner
        [`${componentCls}-arrow`]: {
          position: 'absolute',
          zIndex: 1, // lift it up so the menu wouldn't cask shadow on it
          display: 'block',
          width: sizePopupArrow,
          height: sizePopupArrow,
          // Use linear-gradient to prevent arrow from covering text
          background: `linear-gradient(135deg, transparent 40%, ${colorBgComponent} 40%)`,

          ...roundedArrow(sizePopupArrow, 5, colorBgComponent),
        },

        [`
        &-placement-top > ${componentCls}-arrow,
        &-placement-topLeft > ${componentCls}-arrow,
        &-placement-topRight > ${componentCls}-arrow
      `]: {
          bottom: sizePopupArrow * Math.sqrt(1 / 2) + 2,
          boxShadow: `3px 3px 7px -3px rgba(0, 0, 0, 0.1)`, // FIXME: hardcode
          transform: 'rotate(45deg)',
        },

        [`&-placement-top > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: '50%',
          },
          transform: 'translateX(-50%) rotate(45deg)',
        },

        [`&-placement-topLeft > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`&-placement-topRight > ${componentCls}-arrow`]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`
          &-placement-bottom > ${componentCls}-arrow,
          &-placement-bottomLeft > ${componentCls}-arrow,
          &-placement-bottomRight > ${componentCls}-arrow
        `]: {
          top: (sizePopupArrow + 2) * Math.sqrt(1 / 2),
          boxShadow: `2px 2px 5px -2px rgba(0, 0, 0, 0.1)`, // FIXME: hardcode
          transform: `rotate(-135deg) translateY(-0.5px)`, // FIXME: hardcode
        },

        [`&-placement-bottom > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: '50%',
          },
          transform: `translateX(-50%) rotate(-135deg) translateY(-0.5px)`,
        },

        [`&-placement-bottomLeft > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`&-placement-bottomRight > ${componentCls}-arrow`]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        // =============================================================
        // ==                         Motion                          ==
        // =============================================================
        // When position is not enough for dropdown, the placement will revert.
        // We will handle this with revert motion name.
        [`&${antCls}-slide-down-enter${antCls}-slide-down-enter-active&-placement-bottomLeft,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active&-placement-bottomLeft
          &${antCls}-slide-down-enter${antCls}-slide-down-enter-active&-placement-bottom,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active&-placement-bottom,
          &${antCls}-slide-down-enter${antCls}-slide-down-enter-active&-placement-bottomRight,
          &${antCls}-slide-down-appear${antCls}-slide-down-appear-active&-placement-bottomRight`]: {
          animationName: slideUpIn,
        },

        [`&${antCls}-slide-up-enter${antCls}-slide-up-enter-active&-placement-topLeft,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active&-placement-topLeft,
          &${antCls}-slide-up-enter${antCls}-slide-up-enter-active&-placement-top,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active&-placement-top,
          &${antCls}-slide-up-enter${antCls}-slide-up-enter-active&-placement-topRight,
          &${antCls}-slide-up-appear${antCls}-slide-up-appear-active&-placement-topRight`]: {
          animationName: slideDownIn,
        },

        [`&${antCls}-slide-down-leave${antCls}-slide-down-leave-active&-placement-bottomLeft,
          &${antCls}-slide-down-leave${antCls}-slide-down-leave-active&-placement-bottom,
          &${antCls}-slide-down-leave${antCls}-slide-down-leave-active&-placement-bottomRight`]: {
          animationName: slideUpOut,
        },

        [`&${antCls}-slide-up-leave${antCls}-slide-up-leave-active&-placement-topLeft,
          &${antCls}-slide-up-leave${antCls}-slide-up-leave-active&-placement-top,
          &${antCls}-slide-up-leave${antCls}-slide-up-leave-active&-placement-topRight`]: {
          animationName: slideDownOut,
        },
      },
    },

    {
      // =============================================================
      // ==                          Menu                           ==
      // =============================================================
      [`${componentCls} ${menuCls}`]: {
        position: 'relative',
        margin: 0,
      },

      [`${menuCls}-submenu-popup`]: {
        position: 'absolute',
        zIndex: zIndexDropdown,
        background: 'transparent',
        boxShadow: 'none',
        transformOrigin: '0 0',

        'ul,li': {
          listStyle: 'none',
        },

        ul: {
          marginInline: '0.3em',
        },
      },

      [`${componentCls}, ${componentCls}-menu-submenu`]: {
        [menuCls]: {
          padding: `${dropdownEdgeChildVerticalPadding}px 0`,
          listStyleType: 'none',
          backgroundColor: colorBgComponent,
          backgroundClip: 'padding-box',
          borderRadius: token.controlRadius,
          outline: 'none',
          boxShadow: token.boxShadow,

          [`${menuCls}-item-group-title`]: {
            padding: `${dropdownPaddingVertical}px ${controlPaddingHorizontal}px`,
            color: token.colorTextSecondary,
            transition: `all ${motionDurationSlow}`,
          },

          // ======================= Item Content =======================
          [`${menuCls}-item`]: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          },

          [`${menuCls}-item-icon`]: {
            minWidth: fontSizeBase,
            marginInlineEnd: token.marginXS,
            fontSize: token.fontSizeSM,
          },

          [`${menuCls}-title-content`]: {
            flex: 'auto',

            '> a': {
              color: 'inherit',
              transition: `all ${motionDurationSlow}`,

              '&:hover': {
                color: 'inherit',
              },

              '&::after': {
                position: 'absolute',
                inset: 0,
                content: '""',
              },
            },
          },

          // =========================== Item ===========================
          [`${menuCls}-item, ${menuCls}-submenu-title`]: {
            clear: 'both',
            margin: 0,
            padding: `${dropdownPaddingVertical}px ${controlPaddingHorizontal}px`,
            color: token.colorText,
            fontWeight: 'normal',
            fontSize: fontSizeBase,
            lineHeight: token.lineHeight,
            cursor: 'pointer',
            transition: `all ${motionDurationSlow}`,

            '&:first-child': !dropdownEdgeChildVerticalPadding
              ? {
                  borderRadius: `${radiusBase}px ${radiusBase}px 0 0`,
                }
              : [],

            '&:last-child': !dropdownEdgeChildVerticalPadding
              ? {
                  borderRadius: `0 0 ${radiusBase}px ${radiusBase}px`,
                }
              : [],

            '&-selected': {
              color: token.colorPrimary,
              backgroundColor: token.controlItemBgActive,
            },

            [`&:hover, &-active`]: {
              backgroundColor: token.controlItemBgHover,
            },

            '&-disabled': {
              color: colorTextDisabled,
              cursor: 'not-allowed',

              '&:hover': {
                color: colorTextDisabled,
                backgroundColor: colorBgComponent,
                cursor: 'not-allowed',
              },

              a: {
                pointerEvents: 'none',
              },
            },

            '&-divider': {
              height: 1, // By design
              margin: `${token.marginXXS}px 0`,
              overflow: 'hidden',
              lineHeight: 0,
              backgroundColor: token.colorSplit,
            },

            [`${componentCls}-menu-submenu-expand-icon`]: {
              position: 'absolute',
              insetInlineEnd: token.paddingXS,

              [`${componentCls}-menu-submenu-arrow-icon`]: {
                marginInlineEnd: '0 !important',
                color: token.colorTextSecondary,
                fontSize: fontSizeIcon,
                fontStyle: 'normal',
              },
            },
          },

          [`${menuCls}-item-group-list`]: {
            margin: `0 ${token.marginXS}px`,
            padding: 0,
            listStyle: 'none',
          },

          [`${menuCls}-submenu-title`]: {
            paddingInlineEnd: controlPaddingHorizontal + token.fontSizeSM,
          },

          [`${menuCls}-submenu-vertical`]: {
            position: 'relative',
          },

          [`${menuCls}-submenu${menuCls}-submenu-disabled ${componentCls}-menu-submenu-title`]: {
            [`&, ${componentCls}-menu-submenu-arrow-icon`]: {
              color: colorTextDisabled,
              backgroundColor: colorBgComponent,
              cursor: 'not-allowed',
            },
          },

          // https://github.com/ant-design/ant-design/issues/19264
          [`${menuCls}-submenu-selected ${componentCls}-menu-submenu-title`]: {
            color: token.colorPrimary,
          },
        },
      },
    },

    // Follow code may reuse in other components
    [
      initSlideMotion(rootPrefixCls, 'slide-up', slideUpIn, slideUpOut, token),
      initSlideMotion(rootPrefixCls, 'slide-down', slideDownIn, slideDownOut, token),
    ],
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Dropdown',
  (token, { rootPrefixCls }) => {
    const {
      marginXXS,
      sizePopupArrow,
      controlHeight,
      fontSizeBase,
      lineHeight,
      paddingXXS,
      componentCls,
    } = token;

    const dropdownPaddingVertical = (controlHeight - fontSizeBase * lineHeight) / 2;

    const dropdownToken = mergeToken<DropdownToken>(token, {
      menuCls: `${componentCls}-menu`,
      rootPrefixCls,
      dropdownArrowDistance: sizePopupArrow + marginXXS,
      dropdownArrowOffset: (sizePopupArrow / Math.sqrt(2)) * 2,
      dropdownPaddingVertical,
      dropdownEdgeChildVerticalPadding: paddingXXS,
    });
    return [
      genBaseStyle(dropdownToken),
      genButtonStyle(dropdownToken),
      genStatusStyle(dropdownToken),
    ];
  },
  token => ({
    zIndexDropdown: token.zIndexPopup + 50,
  }),
);
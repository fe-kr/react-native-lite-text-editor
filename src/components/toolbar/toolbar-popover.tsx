import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  type ViewStyle,
  type StyleProp,
  Keyboard,
  Dimensions,
  Platform,
  type LayoutRectangle,
  I18nManager,
  ScrollView,
  StatusBar,
  Animated,
  Modal,
  type ModalProps,
  type ScrollViewProps,
} from 'react-native';
import type { Callback } from '../../types';

export interface ToolbarPopoverProps extends ModalProps {
  anchor: React.ReactNode;
  statusBarHeight?: number;
  screenIndent?: number;
  isRTL?: boolean;
  anchorPosition?: 'top' | 'bottom';
  enterAnimation?: Animated.TimingAnimationConfig;
  leaveAnimation?: Animated.TimingAnimationConfig;
  onShow?: Callback;
  onDismiss?: Callback;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  scrollableProps?: ScrollViewProps;
  overlayStyle?: StyleProp<ViewStyle>;
}

export const ToolbarPopover = (props: ToolbarPopoverProps) => {
  const {
    visible,
    children,
    anchor,
    anchorPosition,
    enterAnimation,
    leaveAnimation,
    isRTL,
    statusBarHeight,
    screenIndent,
    onShow,
    onDismiss,
    wrapperStyle,
    containerStyle,
    overlayStyle,
    scrollableProps,
    ...modalProps
  } = { ...defaultProps, ...props };

  const anchorRef = useRef<React.ComponentRef<View>>(null!);
  const menuRef = useRef<React.ComponentRef<View> | null>(null);
  const opacityRef = useRef(new Animated.Value(0));
  const keyboardHeightRef = useRef(0);
  const prevIsOpenRef = useRef(false);
  const prevVisible = useRef(false);

  const [isOpen, setIsOpen] = useState(visible);
  const [menuLayout, setMenuLayout] = useState<LayoutRectangle>(defaultLayout);
  const [anchorLayout, setAnchorLayout] =
    useState<LayoutRectangle>(defaultLayout);
  const [windowLayout, setWindowLayout] = useState<LayoutRectangle>(() => ({
    ...defaultLayout,
    ...Dimensions.get('window'),
  }));

  const measureInWindow = useCallback(
    (ref: React.RefObject<React.ComponentRef<View> | null>) => {
      const { promise, resolve } = Promise.withResolvers<LayoutRectangle>();

      ref.current?.measureInWindow((x, y, width, height) =>
        resolve({ x, y, width, height })
      );

      return promise;
    },
    []
  );

  const open = useCallback(async () => {
    const [windowLayoutResult, menuLayoutResult, anchorLayoutResult] =
      await Promise.all([
        Promise.resolve(Dimensions.get('window')),
        measureInWindow(menuRef),
        measureInWindow(anchorRef),
      ]);

    if (
      ![
        windowLayoutResult.width,
        windowLayoutResult.height,
        menuLayoutResult.width,
        menuLayoutResult.height,
        anchorLayoutResult.width,
        anchorLayoutResult.height,
      ].every(Boolean)
    ) {
      requestAnimationFrame(open);
      return;
    }

    setAnchorLayout(anchorLayoutResult);
    setMenuLayout(menuLayoutResult);

    setWindowLayout({
      ...defaultLayout,
      ...windowLayoutResult,
      height: windowLayoutResult.height - keyboardHeightRef.current,
    });

    Animated.timing(opacityRef.current, enterAnimation).start(
      ({ finished }) => {
        if (finished) {
          prevIsOpenRef.current = true;
        }
      }
    );

    onShow?.();
  }, [enterAnimation, measureInWindow, onShow]);

  const close = useCallback(() => {
    Animated.timing(opacityRef.current, leaveAnimation).start(
      ({ finished }) => {
        if (finished) {
          setIsOpen(false);
          prevIsOpenRef.current = false;
          setMenuLayout(defaultLayout);
        }
      }
    );

    onDismiss?.();
  }, [leaveAnimation, onDismiss]);

  const updateVisibility = useCallback(
    (isVisible: boolean) => {
      setTimeout(() => {
        if (isVisible && !prevIsOpenRef.current) {
          open();
          return;
        }

        if (!isVisible && prevIsOpenRef.current) {
          close();
          return;
        }
      }, 100);
    },
    [open, close]
  );

  const anchorTop =
    anchorPosition === 'bottom'
      ? anchorLayout.y + anchorLayout.height
      : anchorLayout.y - anchorLayout.height;

  const left = (() => {
    const windowOffsetX = windowLayout.width - menuLayout.width - screenIndent;
    const anchorOffsetX = anchorLayout.x + anchorLayout.width;

    if (anchorLayout.x <= windowOffsetX) {
      return Math.max(anchorLayout.x, screenIndent);
    }

    if (anchorOffsetX > windowLayout.width - screenIndent) {
      return windowOffsetX;
    }

    return anchorOffsetX - menuLayout.width;
  })();

  const menuScrollHeight = (() => {
    let menuHeight = 0;

    const windowOffsetY =
      windowLayout.height - menuLayout.height - screenIndent - statusBarHeight;

    if (
      anchorTop >= windowOffsetY &&
      anchorTop <= windowLayout.height - anchorTop
    ) {
      menuHeight =
        windowLayout.height - anchorTop - screenIndent - statusBarHeight;
    }

    if (
      anchorTop >= windowOffsetY &&
      anchorTop >= windowLayout.height - anchorTop &&
      anchorTop <=
        menuLayout.height - anchorLayout.height + screenIndent - statusBarHeight
    ) {
      menuHeight =
        anchorTop + anchorLayout.height - screenIndent + statusBarHeight;
    }

    return Math.min(menuHeight, windowLayout.height - 2 * screenIndent);
  })();

  const top = (() => {
    const windowOffsetY =
      windowLayout.height - menuLayout.height - screenIndent - statusBarHeight;

    if (
      anchorTop <= windowOffsetY ||
      (anchorTop >= windowOffsetY &&
        anchorTop <= windowLayout.height - anchorTop)
    ) {
      return Math.max(anchorTop, screenIndent);
    }

    if (
      anchorTop + anchorLayout.height + statusBarHeight >
      windowLayout.height - screenIndent
    ) {
      return menuScrollHeight === windowLayout.height - 2 * screenIndent
        ? -screenIndent * 2
        : windowOffsetY;
    }

    return (
      anchorTop + anchorLayout.height - (menuScrollHeight || menuLayout.height)
    );
  })();

  useEffect(() => {
    const opacityAnimation = opacityRef.current;
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => (keyboardHeightRef.current = e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => (keyboardHeightRef.current = 0)
    );

    return () => {
      opacityAnimation.removeAllListeners();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (prevVisible.current === visible) return;

    prevVisible.current = visible;

    if (visible !== isOpen) setIsOpen(visible);
  }, [visible, isOpen]);

  useEffect(() => {
    updateVisibility(visible);
  }, [updateVisibility, visible]);

  const ContentWrapper = menuScrollHeight ? ScrollView : Fragment;

  return (
    <View
      ref={anchorRef}
      style={[styles.wrapperStyle, wrapperStyle]}
      collapsable={false}
    >
      {anchor}

      <Modal {...modalProps} visible={isOpen}>
        <Pressable style={[styles.overlay, overlayStyle]} onPress={close}>
          <Animated.View
            ref={menuRef}
            style={[
              {
                opacity: opacityRef.current,
                top: top + (menuScrollHeight ? statusBarHeight : 0),
                [isRTL ? 'right' : 'left']: left,
                height: menuScrollHeight || undefined,
              },
              styles.containerStyle,
              containerStyle,
            ]}
            pointerEvents={isOpen ? 'box-none' : 'none'}
            collapsable={false}
          >
            <ContentWrapper
              {...(!!menuScrollHeight && {
                ...scrollableProps,
                style: [{ height: menuScrollHeight }, scrollableProps?.style],
              })}
            >
              {children}
            </ContentWrapper>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

export const usePopover = () => {
  const [state, setState] = useState<Record<string, boolean>>({});

  return {
    isOpen: useCallback((id: string) => !!state[id], [state]),
    open: useCallback(
      (id: string) => setState((prevState) => ({ ...prevState, [id]: true })),
      []
    ),
    close: useCallback(
      (id: string) => setState((prevState) => ({ ...prevState, [id]: false })),
      []
    ),
  };
};

const defaultLayout = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
} as const;

const defaultProps = {
  visible: false,
  isRTL: I18nManager.getConstants().isRTL,
  anchorPosition: 'top',
  enterAnimation: {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
  },
  leaveAnimation: {
    toValue: 0,
    duration: 150,
    useNativeDriver: true,
  },
  statusBarHeight: StatusBar.currentHeight ?? 0,
  screenIndent: 8,
  transparent: true,
} satisfies Partial<ToolbarPopoverProps>;

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerStyle: {
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    cursor: Platform.OS === 'web' ? 'auto' : undefined,
    outlineWidth: 0,
  },
});

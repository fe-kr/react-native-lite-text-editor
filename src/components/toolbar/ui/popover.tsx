import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  type ViewStyle,
  type ModalProps,
  type StyleProp,
  Keyboard,
  Dimensions,
  Platform,
  type LayoutRectangle,
  I18nManager,
  type NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';

export interface PopoverProps extends ModalProps {
  anchor: React.ReactNode;
  statusBarHeight?: number;
  anchorPosition?: 'top' | 'bottom';
  animationDuration?: number;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
}

export const Popover = ({
  children,
  anchor,
  anchorPosition = 'top',
  animationDuration = 150,
  statusBarHeight = StatusBar.currentHeight ?? 0,
  onShow,
  onRequestClose,
  wrapperStyle,
  containerStyle,
  overlayStyle,
  visible = false,
  ...props
}: PopoverProps) => {
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
    Animated.timing(opacityRef.current, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        prevIsOpenRef.current = true;
      }
    });

    onShow?.(null!);
  }, [animationDuration, onShow]);

  const close = useCallback(
    (e?: NativeSyntheticEvent<any>) => {
      Animated.timing(opacityRef.current, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsOpen(false);
          prevIsOpenRef.current = false;
          setMenuLayout(defaultLayout);
        }
      });

      onRequestClose?.(e!);
    },
    [animationDuration, onRequestClose]
  );

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
      });
    },
    [open, close]
  );

  const anchorTop =
    anchorPosition === 'bottom'
      ? anchorLayout.y + anchorLayout.height
      : anchorLayout.y - anchorLayout.height;

  const left = useMemo(() => {
    const windowOffsetX = windowLayout.width - menuLayout.width - SCREEN_INDENT;
    const anchorOffsetX = anchorLayout.x + anchorLayout.width;

    if (anchorLayout.x <= windowOffsetX) {
      return Math.max(anchorLayout.x, SCREEN_INDENT);
    }

    if (anchorOffsetX > windowLayout.width - SCREEN_INDENT) {
      return windowOffsetX;
    }

    return anchorOffsetX - menuLayout.width;
  }, [anchorLayout, menuLayout, windowLayout]);

  const menuScrollHeight = useMemo(() => {
    let menuHeight = 0;

    const windowOffsetY =
      windowLayout.height - menuLayout.height - SCREEN_INDENT - statusBarHeight;

    if (
      anchorTop >= windowOffsetY &&
      anchorTop <= windowLayout.height - anchorTop
    ) {
      menuHeight =
        windowLayout.height - anchorTop - SCREEN_INDENT - statusBarHeight;
    }

    if (
      anchorTop >= windowOffsetY &&
      anchorTop >= windowLayout.height - anchorTop &&
      anchorTop <=
        menuLayout.height -
          anchorLayout.height +
          SCREEN_INDENT -
          statusBarHeight
    ) {
      menuHeight =
        anchorTop + anchorLayout.height - SCREEN_INDENT + statusBarHeight;
    }

    return Math.min(menuHeight, windowLayout.height - 2 * SCREEN_INDENT);
  }, [
    windowLayout.height,
    menuLayout.height,
    statusBarHeight,
    anchorTop,
    anchorLayout.height,
  ]);

  const top = useMemo(() => {
    const windowOffsetY =
      windowLayout.height - menuLayout.height - SCREEN_INDENT - statusBarHeight;

    if (
      anchorTop <= windowOffsetY ||
      (anchorTop >= windowOffsetY &&
        anchorTop <= windowLayout.height - anchorTop)
    ) {
      return Math.max(anchorTop, SCREEN_INDENT);
    }

    if (
      anchorTop + anchorLayout.height + statusBarHeight >
      windowLayout.height - SCREEN_INDENT
    ) {
      return menuScrollHeight === windowLayout.height - 2 * SCREEN_INDENT
        ? -SCREEN_INDENT * 2
        : windowOffsetY;
    }

    return (
      anchorTop + anchorLayout.height - (menuScrollHeight || menuLayout.height)
    );
  }, [
    anchorLayout.height,
    anchorTop,
    statusBarHeight,
    menuLayout.height,
    menuScrollHeight,
    windowLayout.height,
  ]);

  const ContentWrapper = menuScrollHeight ? ScrollView : Fragment;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => (keyboardHeightRef.current = e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => (keyboardHeightRef.current = 0)
    );

    return () => {
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

  return (
    <View
      ref={anchorRef}
      style={[styles.wrapperStyle, wrapperStyle]}
      collapsable={false}
    >
      {anchor}

      <Modal
        {...props}
        animationType="none"
        visible={isOpen}
        onRequestClose={close}
        onDismiss={close}
      >
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
            pointerEvents={visible ? 'box-none' : 'none'}
            collapsable={false}
          >
            <ContentWrapper
              {...(!!menuScrollHeight && {
                style: { height: menuScrollHeight },
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

const SCREEN_INDENT = 8;

const { isRTL } = I18nManager.getConstants();

const defaultLayout = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
} as const;

const measureInWindow = <T extends React.ComponentRef<View>>({
  current,
}: React.RefObject<T | null>): Promise<LayoutRectangle> =>
  new Promise((res) => {
    current?.measureInWindow((x, y, width, height) =>
      res({ x, y, width, height })
    );
  });

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  containerStyle: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    shadowColor: '#ccced1',
    shadowRadius: 5,
    elevation: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    cursor: Platform.OS === 'web' ? 'auto' : undefined,
    outlineWidth: 0,
  },
});

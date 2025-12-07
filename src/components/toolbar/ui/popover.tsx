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
  BackHandler,
  Modal,
  type ModalProps,
  type ScrollViewProps,
} from 'react-native';
import type { Callback } from '../../../types';

export interface PopoverProps extends ModalProps {
  anchor: React.ReactNode;
  statusBarHeight?: number;
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

export const Popover = ({
  visible = false,
  children,
  anchor,
  anchorPosition = 'top',
  enterAnimation = defaultEnterAnimation,
  leaveAnimation = defaultLeaveAnimation,
  statusBarHeight = StatusBar.currentHeight ?? 0,
  onShow,
  onDismiss,
  wrapperStyle,
  containerStyle,
  overlayStyle,
  scrollableProps,
  transparent = true,
  ...props
}: PopoverProps) => {
  const anchorRef = useRef<React.ComponentRef<View>>(null!);
  const menuRef = useRef<React.ComponentRef<View> | null>(null);
  const opacityRef = useRef(new Animated.Value(0));
  const keyboardHeightRef = useRef(0);
  const prevIsOpenRef = useRef(false);
  const prevVisible = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isOpen, setIsOpen] = useState(visible);
  const [menuLayout, setMenuLayout] = useState<LayoutRectangle>(defaultLayout);
  const [anchorLayout, setAnchorLayout] =
    useState<LayoutRectangle>(defaultLayout);
  const [windowLayout, setWindowLayout] = useState<LayoutRectangle>(() => ({
    ...defaultLayout,
    ...Dimensions.get('window'),
  }));

  const addEventListeners = useCallback(() => {
    abortControllerRef.current = new AbortController();

    const backPressListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => visible && !!onDismiss?.()
    );
    const dimensionsChangeListener = Dimensions.addEventListener(
      'change',
      () => visible && !!onDismiss?.()
    );

    abortControllerRef.current.signal.addEventListener('abort', () => {
      backPressListener.remove();
      dimensionsChangeListener.remove();
    });

    if (Platform.OS === 'web') {
      document.addEventListener(
        'keyup',
        (e) => e.key === 'Escape' && onDismiss?.(),
        { signal: abortControllerRef.current.signal }
      );
    }
  }, [onDismiss, visible]);

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

    addEventListeners();
    Animated.timing(opacityRef.current, enterAnimation).start(
      ({ finished }) => {
        if (finished) {
          prevIsOpenRef.current = true;
        }
      }
    );

    onShow?.();
  }, [addEventListeners, enterAnimation, onShow]);

  const close = useCallback(() => {
    abortControllerRef.current?.abort();

    Animated.timing(opacityRef.current, leaveAnimation).start(
      ({ finished }) => {
        if (finished) {
          setIsOpen(false);
          prevIsOpenRef.current = false;
          setMenuLayout(defaultLayout);
        }
      }
    );

    abortControllerRef.current = null;

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
      abortControllerRef.current?.abort();
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

      <Modal {...props} transparent={transparent} visible={isOpen}>
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

const SCREEN_INDENT = 8;

const { isRTL } = I18nManager.getConstants();

const defaultLayout = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
} as const;

const defaultEnterAnimation = {
  toValue: 1,
  duration: 150,
  useNativeDriver: true,
} as const;

const defaultLeaveAnimation = {
  toValue: 0,
  duration: 150,
  useNativeDriver: true,
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

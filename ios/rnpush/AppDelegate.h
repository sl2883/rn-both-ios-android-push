#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

#import <UserNotifications/UserNotifications.h>
#import <CleverTapSDK/CleverTap.h>
#import <CleverTapReact/CleverTapReactManager.h>
#import <React/RCTLinkingManager.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic,strong) NSDictionary *resp;

@end

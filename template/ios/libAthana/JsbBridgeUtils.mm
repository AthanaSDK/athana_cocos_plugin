//
//  CocosJsbBridgeWrapperUtils.mm
//  Athana Demo
//
//  Created by CWJoy on 18/12/2025.
//

#include "JsbBridgeUtils.h"
#include "platform/apple/JsbBridgeWrapper.h"

@interface JsbBridgeUtils ()
@property (nonatomic, copy, nullable) JsbBridgeUtilsCallback callback;
@end

@implementation JsbBridgeUtils

-(id)init{
    self = [super init];
    
    if (self) {
        // 建议监听列表
        NSArray *methods = @[
            @"init", @"start", @"requestReview", @"requestNotifications",
            // account service
            @"currentUser", @"registerUser", @"signIn", @"signInWithUI", @"signOut", @"accountBinding", @"accountUnbind", @"queryAllAccountBind", @"updateUserInfo",
            // ad service
            @"loadAd", @"isReadyAd", @"showAd",
            @"bannerCreate", @"bannerShow", @"bannerHide", @"bannerUpdateSize", @"bannerUpdateAlignment", @"bannerDestroy",
            // iap service
            @"isAvailable",@"queryProducts",@"purchase",@"queryPurchaseHistory",@"verifyOrder",
            // event service
            @"sendEvent"
        ];
        
        for (NSString *method in methods) {
            [self listenOn:method];
        }
    }
    
    return self;
}

- (void)listenOn:(NSString * _Nonnull)methodName; {
    JsbBridgeWrapper* wrapper = [JsbBridgeWrapper sharedInstance];
    OnScriptEventListener listener = ^void(NSString* _Nullable arg){
        self.callback(methodName, arg);
    };
    
    [wrapper addScriptEventListener:methodName listener:[listener copy]];
}

- (void)registerCallback:(JsbBridgeUtilsCallback _Nullable)callback {
    self.callback = callback;
}

+ (void)send:(NSString * _Nonnull)methodName arg:(NSString * _Nullable)arg; {
    JsbBridgeWrapper* wrapper = [JsbBridgeWrapper sharedInstance];
    
    if (arg != nil) {
        [wrapper dispatchEventToScript:methodName arg:[arg copy]];
    } else {
        [wrapper dispatchEventToScript:methodName];
    }
}


@end

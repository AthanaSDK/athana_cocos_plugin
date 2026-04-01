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

static JsbBridgeUtils *_sharedInstance = nil;

@implementation JsbBridgeUtils

+ (instancetype)sharedInstance {
    if (_sharedInstance == nil) {
        _sharedInstance = [[JsbBridgeUtils alloc] init];
    }
    return _sharedInstance;
}

- (id)init {
    self = [super init];
    return self;
}

+ (void)listenOn:(NSString * _Nonnull)methodName {
    JsbBridgeWrapper* wrapper = [JsbBridgeWrapper sharedInstance];
    OnScriptEventListener listener = ^void(NSString* _Nullable arg){
        if (_sharedInstance.callback) {
            _sharedInstance.callback(methodName, arg);
        }
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
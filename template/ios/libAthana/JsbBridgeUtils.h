//
//  CocosJsbBridgeWrapperUtils.h
//  Athana Demo
//
//  Created by CWJoy on 18/12/2025.
//

#import <Foundation/Foundation.h>

typedef void (^JsbBridgeUtilsCallback)(NSString * _Nonnull methodName, NSString * _Nullable arg);

@interface JsbBridgeUtils:NSObject

+ (instancetype _Nonnull)sharedInstance;

- (void)registerCallback:(void (^_Nullable)(NSString *_Nonnull methodName, NSString * _Nullable arg))callback;

+ (void)listenOn:(NSString *_Nonnull)methodName;

+ (void)send:(NSString *_Nonnull)methodName arg:(NSString *_Nullable)arg;

@end
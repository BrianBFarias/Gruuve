#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "RNPermissionsModule.h"
#import "RNPermissionHandlerPhotoLibrary.h"

FOUNDATION_EXPORT double RNPermissionsVersionNumber;
FOUNDATION_EXPORT const unsigned char RNPermissionsVersionString[];


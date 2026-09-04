<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContactSettingsController;
use App\Http\Controllers\Api\HomeStatController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This is the single-page application. Every GET request that is not an
| API or system endpoint returns the React app (resources/views/app.blade.php).
| The React `react-router` handles client-side routing from there.
|
*/

Route::prefix('api')->group(function () {
    // Public: authenticated user
    Route::middleware('auth')->get('/user', function (Request $request) {
        return $request->user();
    });

    // Public project reads
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);

    // Public content reads
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/contact-settings', [ContactSettingsController::class, 'index']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/careers', [CareerController::class, 'index']);
    Route::get('/home-stats', [HomeStatController::class, 'index']);
    Route::get('/about', [AboutController::class, 'index']);

    // Public: contact form submission
    Route::post('/contacts', [ContactController::class, 'store']);

    // Admin project management
    Route::middleware('auth')->prefix('projects')->group(function () {
        Route::post('/import', [ProjectController::class, 'import']);
        Route::post('/reset', [ProjectController::class, 'reset']);
        Route::post('/', [ProjectController::class, 'store']);
        Route::put('/{id}', [ProjectController::class, 'update']);
        Route::delete('/{id}', [ProjectController::class, 'destroy']);
        Route::post('/{id}/reorder', [ProjectController::class, 'reorder']);
        Route::post('/{id}/featured', [ProjectController::class, 'setFeatured']);
    });

    // Admin: testimonials
    Route::middleware('auth')->prefix('testimonials')->group(function () {
        Route::post('/', [TestimonialController::class, 'store']);
        Route::put('/{id}', [TestimonialController::class, 'update']);
        Route::delete('/{id}', [TestimonialController::class, 'destroy']);
    });

    // Admin: contact settings + offices
    Route::middleware('auth')->group(function () {
        Route::put('/contact-settings', [ContactSettingsController::class, 'update']);
        Route::post('/offices', [ContactSettingsController::class, 'storeOffice']);
        Route::put('/offices/{id}', [ContactSettingsController::class, 'updateOffice']);
        Route::delete('/offices/{id}', [ContactSettingsController::class, 'destroyOffice']);
    });

    // Admin: services
    Route::middleware('auth')->prefix('services')->group(function () {
        Route::post('/', [ServiceController::class, 'store']);
        Route::put('/{id}', [ServiceController::class, 'update']);
        Route::delete('/{id}', [ServiceController::class, 'destroy']);
    });

    // Admin: careers (openings + values + benefits)
    Route::middleware('auth')->prefix('careers')->group(function () {
        Route::post('/openings', [CareerController::class, 'storeOpening']);
        Route::put('/openings/{id}', [CareerController::class, 'updateOpening']);
        Route::delete('/openings/{id}', [CareerController::class, 'destroyOpening']);
        Route::post('/values', [CareerController::class, 'storeValue']);
        Route::put('/values/{id}', [CareerController::class, 'updateValue']);
        Route::delete('/values/{id}', [CareerController::class, 'destroyValue']);
        Route::post('/benefits', [CareerController::class, 'storeBenefit']);
        Route::put('/benefits/{id}', [CareerController::class, 'updateBenefit']);
        Route::delete('/benefits/{id}', [CareerController::class, 'destroyBenefit']);
    });

    // Admin: home stats
    Route::middleware('auth')->prefix('home-stats')->group(function () {
        Route::post('/', [HomeStatController::class, 'store']);
        Route::put('/{id}', [HomeStatController::class, 'update']);
        Route::delete('/{id}', [HomeStatController::class, 'destroy']);
    });

    // Admin: about (settings + values + milestones)
    Route::middleware('auth')->prefix('about')->group(function () {
        Route::put('/', [AboutController::class, 'update']);
        Route::post('/values', [AboutController::class, 'storeValue']);
        Route::put('/values/{id}', [AboutController::class, 'updateValue']);
        Route::delete('/values/{id}', [AboutController::class, 'destroyValue']);
        Route::post('/milestones', [AboutController::class, 'storeMilestone']);
        Route::put('/milestones/{id}', [AboutController::class, 'updateMilestone']);
        Route::delete('/milestones/{id}', [AboutController::class, 'destroyMilestone']);
    });

    // Admin: contact submissions
    Route::middleware('auth')->prefix('contacts')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::patch('/{id}/read', [ContactController::class, 'updateRead']);
        Route::delete('/{id}', [ContactController::class, 'destroy']);
    });

    // Admin (administrators only): user accounts
    Route::middleware(['auth', 'admin'])->prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*')->where('any', '^(?!api|up|storage|_debugbar|verify-email).*');

require __DIR__.'/auth.php';

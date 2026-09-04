<?php

namespace App\Traits;

trait Localizable
{
    /**
     * Override toArray to apply translations based on X-Locale header.
     *
     * @return array
     */
    public function toArray()
    {
        $array = parent::toArray();
        $locale = request()->header('X-Locale', 'en');
        
        if ($locale !== 'en' && isset($array['translations']) && is_array($array['translations'])) {
            $translations = $array['translations'];
            if (isset($translations[$locale]) && is_array($translations[$locale])) {
                foreach ($translations[$locale] as $field => $value) {
                    if (!empty($value)) {
                        $array[$field] = $value;
                    }
                }
            }
        }
        
        return $array;
    }

    /**
     * Get the casts array.
     *
     * @return array<string, string>
     */
    public function getCasts()
    {
        return array_merge(parent::getCasts(), [
            'translations' => 'array',
        ]);
    }
}

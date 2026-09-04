<?php

namespace Database\Seeders;

use App\Models\AboutSetting;
use App\Models\AboutValue;
use App\Models\CareerBenefit;
use App\Models\CareerValue;
use App\Models\ContactSetting;
use App\Models\HomeStat;
use App\Models\Milestone;
use App\Models\Office;
use App\Models\Opening;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the content tables with the placeholder site content.
     */
    public function run(): void
    {
        // Contact settings (single row)
        ContactSetting::query()->delete();
        ContactSetting::create([
            'phone' => '+251 11 000 0000',
            'email' => 'info@obmconstruction.com',
            'address_line_1' => 'Bole Road, Addis Ababa',
            'address_line_2' => 'Ethiopia',
        ]);

        // Offices
        Office::query()->delete();
        Office::create([
            'name' => 'Head Office',
            'address' => 'Bole Road',
            'city' => 'Addis Ababa, Ethiopia',
            'phone' => '+251 11 000 0000',
            'email' => 'info@obmconstruction.com',
            'sort_order' => 0,
        ]);
        Office::create([
            'name' => 'Addis Regional Office',
            'address' => 'Addis Ababa',
            'city' => 'Addis Ababa',
            'phone' => '+251 11 000 0000',
            'email' => 'addis@obmconstruction.com',
            'sort_order' => 1,
        ]);

        // Testimonials
        Testimonial::query()->delete();
        $testimonials = [
            [
                'quote' => 'OBM delivered our project on time and to a standard that exceeded our expectations. Their engineering discipline was evident at every stage.',
                'name' => 'Client Name',
                'role' => 'Project Director',
                'company' => 'Organization',
            ],
            [
                'quote' => 'From planning to handover, their team demonstrated professionalism, transparency and a genuine commitment to quality.',
                'name' => 'Client Name',
                'role' => 'Managing Director',
                'company' => 'Organization',
            ],
            [
                'quote' => 'Safety, quality and integrity — OBM brings real engineering expertise to the Ethiopian built environment.',
                'name' => 'Client Name',
                'role' => 'Chief Architect',
                'company' => 'Organization',
            ],
        ];
        foreach ($testimonials as $i => $testimonial) {
            Testimonial::create($testimonial + ['sort_order' => $i]);
        }

        // Services
        Service::query()->delete();
        $services = [
            [
                'title' => 'Building Construction',
                'description' => 'Commercial and residential buildings delivered to structural and safety standards.',
                'overview' => 'We construct commercial and residential buildings end to end — from foundations and structure to finishes. Our teams combine rigorous engineering with disciplined site management to deliver quality buildings on time and on budget.',
                'image' => 'facade',
                'image_key' => 'building',
                'capabilities' => [
                    'Commercial building construction',
                    'Residential and apartment blocks',
                    'Reinforced concrete structures',
                    'Shell & core delivery',
                    'Internal fit-out and finishes',
                ],
            ],
            [
                'title' => 'Civil & Infrastructure',
                'description' => 'Foundations, earthworks and structural works executed with engineering precision.',
                'overview' => 'Our civil engineering capability covers foundations, earthworks, drainage and heavy structural works. We bring the machinery, methodology and oversight to handle complex ground conditions and large-scale civil delivery.',
                'image' => 'framework',
                'image_key' => 'civil',
                'capabilities' => [
                    'Deep foundations and piling',
                    'Earthworks and grading',
                    'Drainage and storm-water systems',
                    'Retaining structures',
                    'Public infrastructure works',
                ],
            ],
            [
                'title' => 'Road Construction',
                'description' => 'Road corridors, asphalt and associated works delivered on schedule.',
                'overview' => 'We build road corridors that move people and goods safely and reliably. From earthworks and sub-base to asphalt surfacing, signage and drainage, we deliver roads built to last.',
                'image' => 'road',
                'image_key' => 'roads',
                'capabilities' => [
                    'Urban and regional road construction',
                    'Earthworks and sub-base',
                    'Asphalt and concrete surfacing',
                    'Drainage and culverts',
                    'Road safety and signage',
                ],
            ],
            [
                'title' => 'Engineering & Project Management',
                'description' => 'Design, planning and end-to-end delivery management with full control.',
                'overview' => 'Beyond building, we engineer and manage. Our teams provide design coordination, planning, cost control and site supervision that keep complex projects disciplined, safe and on schedule from brief to handover.',
                'image' => 'crane',
                'image_key' => 'engineering',
                'capabilities' => [
                    'Construction planning & scheduling',
                    'Cost estimation & control',
                    'Design coordination',
                    'Site supervision & QA/QC',
                    'Health, safety & quality management',
                ],
            ],
            [
                'title' => 'Renovation & Maintenance',
                'description' => 'Modernization and structural strengthening of existing buildings.',
                'overview' => 'We renew existing buildings through renovation, modernization and structural strengthening. Working within live environments, we upgrade performance and appearance while protecting occupants and operations.',
                'image' => 'facade',
                'image_key' => 'renovation',
                'capabilities' => [
                    'Building renovation & modernization',
                    'Structural strengthening',
                    'Facade restoration',
                    'Interior refurbishment',
                    'Preventive maintenance',
                ],
            ],
            [
                'title' => 'Design & Construction Solutions',
                'description' => 'Integrated design-and-build solutions from concept to completion.',
                'overview' => 'A single accountable partner from the first concept to the final key. Our integrated design-and-build approach aligns architecture, engineering and construction for faster, higher-quality and lower-risk delivery.',
                'image' => 'framework',
                'image_key' => 'design',
                'capabilities' => [
                    'Design & build delivery',
                    'Value engineering',
                    'Concept to completion',
                    'Alternative contracting models',
                    'Turnkey project solutions',
                ],
            ],
        ];
        foreach ($services as $i => $service) {
            Service::create($service + ['sort_order' => $i]);
        }

        // Career openings
        Opening::query()->delete();
        $openings = [
            ['title' => 'Site Engineer', 'department' => 'Construction', 'location' => 'Addis Ababa', 'type' => 'Full-time', 'blurb' => 'Join our site teams to manage quality, safety and schedule on live construction projects.'],
            ['title' => 'Project Engineer', 'department' => 'Engineering', 'location' => 'Addis Ababa', 'type' => 'Full-time', 'blurb' => 'Support design coordination, planning and technical delivery across multiple projects.'],
            ['title' => 'Quantity Surveyor', 'department' => 'Commercial', 'location' => 'Addis Ababa', 'type' => 'Full-time', 'blurb' => 'Own cost estimation, measurement and commercial control across the project portfolio.'],
            ['title' => 'Health, Safety & Environment Officer', 'department' => 'HSE', 'location' => 'Field based', 'type' => 'Full-time', 'blurb' => 'Champion safety on site and embed a strong HSE culture across our operations.'],
        ];
        foreach ($openings as $i => $opening) {
            Opening::create($opening + ['sort_order' => $i]);
        }

        // Career values
        CareerValue::query()->delete();
        $values = [
            ['title' => 'Do work that lasts', 'text' => 'Every project is a permanent contribution to Ethiopia\u2019s built environment.'],
            ['title' => 'Answerable to each other', 'text' => 'A flat, accountable culture where every voice is heard on site and in the office.'],
            ['title' => 'Grow with the build', 'text' => 'Clear paths to progress from engineer to project leadership.'],
        ];
        foreach ($values as $i => $value) {
            CareerValue::create($value + ['sort_order' => $i]);
        }

        // Career benefits
        CareerBenefit::query()->delete();
        $benefits = [
            'Competitive project-based compensation',
            'Health insurance cover',
            'Structured safety training and PPE',
            'Career development and mentoring',
            'Field and office opportunities across Ethiopia',
        ];
        foreach ($benefits as $i => $benefit) {
            CareerBenefit::create(['text' => $benefit, 'sort_order' => $i]);
        }

        // Home stats
        HomeStat::query()->delete();
        $stats = [
            ['label' => 'Years of experience', 'value' => 15, 'suffix' => '+'],
            ['label' => 'Projects delivered', 'value' => 120, 'suffix' => '+'],
            ['label' => 'Square meters built', 'value' => 500, 'suffix' => 'K+'],
            ['label' => 'Engineers & staff', 'value' => 300, 'suffix' => '+'],
        ];
        foreach ($stats as $i => $stat) {
            HomeStat::create($stat + ['sort_order' => $i]);
        }

        // About settings
        AboutSetting::query()->delete();
        AboutSetting::create([
            'mission' => 'To deliver safe, quality construction projects on time and on budget, creating lasting value for our clients, our people and the communities we serve across Ethiopia.',
            'vision' => 'To be the most trusted and respected construction company in Ethiopia, recognised for engineering excellence, integrity and enduring results.',
        ]);

        // About values
        AboutValue::query()->delete();
        $aboutValues = [
            ['title' => 'Safety', 'description' => 'Every decision protects the wellbeing of our people and the public. Safety is non-negotiable.'],
            ['title' => 'Quality', 'description' => 'We hold every material, detail and process to the highest construction standard.'],
            ['title' => 'Integrity', 'description' => 'We do what we say, communicate honestly and build relationships on trust.'],
            ['title' => 'Reliability', 'description' => 'We plan carefully and deliver on time — our clients can depend on us.'],
            ['title' => 'Engineering Excellence', 'description' => 'Rigorous analysis and precise execution underpin everything we build.'],
        ];
        foreach ($aboutValues as $i => $value) {
            AboutValue::create($value + ['sort_order' => $i]);
        }

        // Milestones
        Milestone::query()->delete();
        $milestones = [
            ['year' => '2010', 'title' => 'OBM Construction founded', 'description' => 'Company incorporated in Ethiopia to deliver quality construction.'],
            ['year' => '2014', 'title' => 'First large-scale build', 'description' => 'Delivered a landmark commercial project, establishing our reputation.'],
            ['year' => '2018', 'title' => 'Expanded engineering team', 'description' => 'Grew our in-house engineering and project-management capability.'],
            ['year' => '2021', 'title' => 'Infrastructure division', 'description' => 'Formalised a dedicated roads and infrastructure practice.'],
            ['year' => '2024', 'title' => 'Continued growth', 'description' => 'Building across commercial, residential and infrastructure sectors.'],
        ];
        foreach ($milestones as $i => $milestone) {
            Milestone::create($milestone + ['sort_order' => $i]);
        }
    }
}